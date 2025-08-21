import { tool, generateText } from 'ai';
import { z } from 'zod';
import { getSchemasForTables } from './schemas';
export const getSchemaForTableNames = tool({
    description: `
        gets the schemas for the given table names array.
        - Takes in an array of table names
        - Returns a string containing the schema definitions for those tables
    `,
    inputSchema: z.object({
        tableNames: z.array(z.string()).describe('Array of table names to get schemas for'),
    }),
    execute: async ({ tableNames }) => {
        console.log('getSchemaForTableNames called with tableNames:', tableNames);
        const schemas = getSchemasForTables(tableNames);
        return { schemas };
    }
});