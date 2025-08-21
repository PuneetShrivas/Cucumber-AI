import { generateText, tool } from 'ai';
import { z } from 'zod';
export const generateSQL =({organization_id, location_id}: {organization_id: string, location_id?: string}) => tool({
    name: 'generateSQL',
    description: `
Generate a valid SQL query based on a schema and a user instruction.
Use this tool whenever you want to transform a natural language instruction into a SQL query.
  `,
    inputSchema: z.object({
        schema: z.string().describe('PostgreSQL table schema definitions'),
        instruction: z.string().describe('User instruction to convert into SQL'),
    }),
    execute: async ({ schema, instruction }) => {
        console.log('Generating SQL for instruction:', instruction);
        // console.log('Using schema:', schema);
        console.log('Organization ID:', organization_id);
        console.log('Location ID:', location_id);
        const systemPrompt = `
You are a senior backend engineer responsible for generating precise SQL queries.
You will be given the schema of one or more database tables.
You will also be given a user instruction in natural language.
Your job is to return a correct SQL query that:
- strictly follows the provided schema
- includes only the relevant columns and joins
- uses proper filtering and safety constraints
- does not guess any columns or relationships
- when possible try to minimize query length by using * instead of all names or necessary columns only

Only return a single SQL query. No explanations or extra content at all.
${organization_id ? `The organization_id to use is ${organization_id}${location_id ? ` and location_id is ${location_id}` : ''}.` : ''}
--- Schema ---
${schema}

    `.trim();

        const result = await generateText({
            model: 'xai/grok-3',
            system: systemPrompt,
            messages: [{ role: 'user', content: instruction }],
        });
        console.log('Generated SQL:', result.text.trim());
        return {
            sql: result.text.trim().replace(/;\s*$/, ''), // Remove trailing semicolon if present
        };
    },
});
