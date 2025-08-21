import { generateText, tool } from 'ai';
import { z } from 'zod';
import { gateway } from '@ai-sdk/gateway';
import { openai } from '@ai-sdk/openai';

export const webSearch = tool({
    name: 'webSearch',
    description: `
Perform a web search based on a user query.
Use this tool whenever you want to retrieve information from the web.
  `,
    inputSchema: z.object({
        query: z.string().describe('The search query to perform'),
    }),
    execute: async ({ query }) => {
        console.log('Executing web search with query:', query);
        const systemPrompt = `
        Perform a concise web search generating a response that is no longer than 500 words at max. Try to be as concise.
        avoid using any markdown formatting give plain text and do not use square brackets or any other formatting.
    `.trim();
        try {
            const { text, sources } = await generateText({
                model: gateway('gpt-4o-mini'),
                system: systemPrompt,
                prompt: query,
                tools:{
                     web_search_preview: openai.tools.webSearchPreview({
                        searchContextSize: 'medium',
                        userLocation:{
                            type:"approximate",
                            city:"Bengaluru",
                            region:"India",
                            timezone:"Asia/Kolkata"
                        }
                    }),
                },
                toolChoice: {type:'tool', toolName: 'web_search_preview'},
            });
            console.log('Web search result:', text, 'Sources:', sources);
            return {
                result: text
            };
        } catch (error) {
            console.log('Error during web search:', error);
        }
        return {
            result: 'an error occurred during the web search.'
        };

    },
});
