// app/api/ai/generate-reply/route.ts
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
// Alternative providers you can use:
// import { anthropic } from '@ai-sdk/anthropic';
// import { google } from '@ai-sdk/google';

export const runtime = 'edge';

// Define types for the request
interface GenerateReplyRequest {
  prompt: string;
  tone: string;
  organization_id: string;
  platform?: string;
  rating_range?: {
    min: number | null;
    max: number | null;
  };
  context?: {
    business_name?: string;
    industry?: string;
    brand_voice?: string;
  };
}

// Tone-specific system prompts
const TONE_PROMPTS = {
  neutral: "Write in a professional, balanced tone that is neither overly formal nor too casual.",
  thankful: "Write with genuine appreciation and gratitude, expressing sincere thanks for the customer's feedback.",
  apologetic: "Write with understanding and empathy, acknowledging concerns while maintaining professionalism.",
  professional: "Write in a formal, business-appropriate tone that maintains corporate standards.",
  friendly: "Write in a warm, approachable tone that feels personal and genuine while remaining professional."
};

// Platform-specific guidelines
const PLATFORM_GUIDELINES = {
  google: "Follow Google's best practices for business replies - be helpful, authentic, and encourage future visits.",
  yelp: "Write responses that align with Yelp's community guidelines - be genuine and focus on the customer experience.",
  facebook: "Use Facebook's conversational style - be personable and community-focused.",
  tripadvisor: "Focus on hospitality and travel experience elements, encouraging future bookings.",
  amazon: "Address product-specific feedback and maintain Amazon's customer-centric approach."
};

// Rating-specific approaches
const getRatingGuidance = (min: number | null, max: number | null) => {
  const minRating = min || 1;
  const maxRating = max || 5;
  
  if (minRating >= 4) {
    return "This is for positive reviews (4-5 stars). Express genuine gratitude, reinforce positive experiences, and invite future engagement.";
  } else if (maxRating <= 2) {
    return "This is for negative reviews (1-2 stars). Show empathy, acknowledge concerns, offer solutions, and provide contact information for resolution.";
  } else if (minRating >= 3 && maxRating <= 3) {
    return "This is for neutral reviews (3 stars). Thank the customer, address any concerns mentioned, and highlight improvements or positive aspects.";
  } else {
    return "This covers mixed ratings. Tailor the response based on the specific rating and feedback content.";
  }
};

export async function POST(req: NextRequest) {
  try {
    const body: GenerateReplyRequest = await req.json();
    
    // Validate required fields
    if (!body.prompt?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build the system prompt
    const systemPrompt = buildSystemPrompt(body);
    
    // Build the user prompt
    const userPrompt = buildUserPrompt(body);

    // Generate the streaming response using Vercel AI SDK
    const result = await streamText({
      model: 'openai/gpt-3.5-turbo', // or use 'gpt-3.5-turbo' for faster/cheaper responses
      // Alternative models:
      // model: anthropic('claude-3-sonnet-20240229'),
      // model: google('gemini-pro'),
      
      system: systemPrompt,
      prompt: userPrompt,
      
      // Configuration options
      temperature: 0.7, // Balance between creativity and consistency
    //   maxTokens: 500,   // Reasonable length for review replies
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      
      // Optional: Add safety settings
      // safetySettings: [
      //   {
      //     category: 'HARM_CATEGORY_HARASSMENT',
      //     threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      //   }
      // ]
    });

    // Return the streaming response
    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error('Error in AI generation:', error);
    
    // Handle specific error types
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

function buildSystemPrompt(body: GenerateReplyRequest): string {
  const { tone, platform, rating_range, context } = body;
  
  let systemPrompt = `You are an expert customer service representative tasked with writing professional, empathetic, and effective replies to customer reviews.

CORE GUIDELINES:
- Always maintain a professional and respectful tone
- Keep responses concise but meaningful (typically 2-4 sentences)
- Personalize responses when possible
- Include a call-to-action when appropriate
- Never make promises you cannot keep
- Always thank customers for their feedback
- Use proper grammar and spelling
- Avoid overly generic responses

`;

  // Add tone-specific guidance
  if (tone && TONE_PROMPTS[tone as keyof typeof TONE_PROMPTS]) {
    systemPrompt += `TONE GUIDANCE: ${TONE_PROMPTS[tone as keyof typeof TONE_PROMPTS]}\n\n`;
  }

  // Add platform-specific guidance
  if (platform && PLATFORM_GUIDELINES[platform as keyof typeof PLATFORM_GUIDELINES]) {
    systemPrompt += `PLATFORM GUIDANCE: ${PLATFORM_GUIDELINES[platform as keyof typeof PLATFORM_GUIDELINES]}\n\n`;
  }

  // Add rating-specific guidance
  if (rating_range) {
    const ratingGuidance = getRatingGuidance(rating_range.min, rating_range.max);
    systemPrompt += `RATING GUIDANCE: ${ratingGuidance}\n\n`;
  }

  // Add business context if provided
  if (context) {
    systemPrompt += `BUSINESS CONTEXT:\n`;
    if (context.business_name) {
      systemPrompt += `- Business Name: ${context.business_name}\n`;
    }
    if (context.industry) {
      systemPrompt += `- Industry: ${context.industry}\n`;
    }
    if (context.brand_voice) {
      systemPrompt += `- Brand Voice: ${context.brand_voice}\n`;
    }
    systemPrompt += `\n`;
  }

  systemPrompt += `TEMPLATE VARIABLES:
You may use these placeholders in your response (they will be replaced automatically):
- {customer_name} - The customer's name
- {business_name} - The business name
- {review_rating} - The review rating (1-5 stars)
- {review_text} - The original review content
- {platform} - The review platform
- {date} - Current date

OUTPUT REQUIREMENTS:
- Provide ONLY the reply text, no additional formatting or explanations
- Do not include quotes around the response
- Ensure the response is ready to be used as-is
- Maximum 150 words`;

  return systemPrompt;
}

function buildUserPrompt(body: GenerateReplyRequest): string {
  const { prompt, tone, platform, rating_range } = body;
  
  let userPrompt = `Generate a professional review reply based on the following request:\n\n`;
  
  userPrompt += `SPECIFIC REQUEST: ${prompt}\n\n`;
  
  // Add context details
  userPrompt += `ADDITIONAL CONTEXT:\n`;
  userPrompt += `- Tone: ${tone}\n`;
  
  if (platform) {
    userPrompt += `- Platform: ${platform}\n`;
  }
  
  if (rating_range?.min || rating_range?.max) {
    userPrompt += `- Target Rating Range: ${rating_range.min || 1}-${rating_range.max || 5} stars\n`;
  }
  
  userPrompt += `\nPlease generate an appropriate reply that addresses the request while following all the guidelines provided in the system prompt.`;
  
  return userPrompt;
}

// // Alternative implementation for non-streaming response (if needed)
// export async function generateStaticReply(body: GenerateReplyRequest) {
//   const { generateText } = await import('ai');
  
//   const systemPrompt = buildSystemPrompt(body);
//   const userPrompt = buildUserPrompt(body);
  
//   const result = await generateText({
//     model: 'gpt-4-turbo-preview',
//     system: systemPrompt,
//     prompt: userPrompt,
//     temperature: 0.7,
//   });
  
//   return result.text;
// }