import { NextRequest } from 'next/server';
import { streamText } from 'ai';

export const runtime = 'edge';

interface SocialMessage {
    id: string;
    organization_id: string;
    platform: string;
    external_message_id: string;
    thread_id?: string;
    from_user: any;
    to_user: any;
    body: string;
    attachments?: any[];
    sentiment_label?: string;
    status: 'unread' | 'read' | 'replied' | 'escalated' | 'resolved';
    linked_review_id?: string;
    linked_ticket_id?: string;
    assigned_to?: string;
    created_at: string;
    received_at: string;
    processed_at?: string;
}

const TONE_PROMPTS = {
    neutral: "Write in a professional, balanced tone that is neither overly formal nor too casual.",
    thankful: "Write with genuine appreciation and gratitude, expressing sincere thanks for the customer's message.",
    apologetic: "Write with understanding and empathy, acknowledging concerns while maintaining professionalism.",
    professional: "Write in a formal, business-appropriate tone that maintains corporate standards.",
    friendly: "Write in a warm, approachable tone that feels personal and genuine while remaining professional."
};

const PLATFORM_GUIDELINES = {
    twitter: "Keep replies concise, friendly, and public-facing. Avoid sharing sensitive information.",
    facebook: "Use Facebook's conversational style - be personable and community-focused.",
    instagram: "Be visually engaging, positive, and encourage further interaction.",
    linkedin: "Maintain professionalism and align with business etiquette.",
    whatsapp: "Be direct, clear, and respectful in private communication."
};

export async function POST(req: NextRequest) {
    try {
        const body: { item: SocialMessage; tone?: keyof typeof TONE_PROMPTS } = await req.json();

        // if (!body.item?.body?.trim()) {
        //     return new Response(
        //         JSON.stringify({ error: 'Message body is required' }),
        //         { status: 400, headers: { 'Content-Type': 'application/json' } }
        //     );
        // }

        const systemPrompt = buildSystemPrompt(body.item, body.tone);
        const userPrompt = buildUserPrompt(body.item, body.tone);

        const result = streamText({
            model: 'openai/gpt-3.5-turbo',
            system: systemPrompt,
            prompt: userPrompt,
            temperature: 0.7,
            topP: 0.9,
            frequencyPenalty: 0.1,
            presencePenalty: 0.1,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Error in AI generation:', error);

        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                return new Response(
                    JSON.stringify({ error: 'AI service configuration error' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }
            if (error.message.includes('rate limit')) {
                return new Response(
                    JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
                    { status: 429, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        return new Response(
            JSON.stringify({ error: 'Failed to generate reply' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

function buildSystemPrompt(item: SocialMessage, tone?: keyof typeof TONE_PROMPTS): string {
    let prompt = `You are a social media customer service expert. Write professional, empathetic, and effective replies to customer messages.

CORE GUIDELINES:
- Always maintain a professional and respectful tone
- Keep responses concise but meaningful (2-4 sentences)
- Personalize responses when possible
- Include a call-to-action when appropriate
- Never make promises you cannot keep
- Thank users for their message
- Use proper grammar and spelling
- Avoid generic responses

`;

    if (tone && TONE_PROMPTS[tone]) {
        prompt += `TONE GUIDANCE: ${TONE_PROMPTS[tone]}\n\n`;
    }

    if (item.platform && PLATFORM_GUIDELINES[item.platform as keyof typeof PLATFORM_GUIDELINES]) {
        prompt += `PLATFORM GUIDANCE: ${PLATFORM_GUIDELINES[item.platform as keyof typeof PLATFORM_GUIDELINES]}\n\n`;
    }

    prompt += `MESSAGE CONTEXT:
- Platform: ${item.platform}
- Sentiment: ${item.sentiment_label || 'unknown'}
- Status: ${item.status}
- Received At: ${item.received_at}
- From User: ${JSON.stringify(item.from_user)}
- To User: ${JSON.stringify(item.to_user)}

OUTPUT REQUIREMENTS:
- Provide ONLY the reply text, no additional formatting or explanations
- Do not include quotes around the response
- Ensure the response is ready to be used as-is
- Maximum 150 words`;

    return prompt;
}

function buildUserPrompt(item: SocialMessage, tone?: keyof typeof TONE_PROMPTS): string {
    let prompt = `Generate a reply to the following social message:\n\n`;
    prompt += `MESSAGE BODY: ${item.body}\n\n`;
    prompt += `ADDITIONAL CONTEXT:\n`;
    prompt += `- Tone: ${tone || 'neutral'}\n`;
    prompt += `- Platform: ${item.platform}\n`;
    prompt += `- Sentiment: ${item.sentiment_label || 'unknown'}\n`;
    prompt += `\nPlease generate an appropriate reply that addresses the message and follows all guidelines.`;
    return prompt;
}