/**
 * 2️⃣ SQL Executor
 *   - Input: { sql: string }
 *   - Output: the result set or error from Supabase
 */
import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

export const executeSQL = tool({
    description: `
        Given a valid SQL string, execute it against the Supabase database using the Postgres RPC function "execute_any_sql".
        Input: { sql: string }
        Output: The result set as JSON, or an error message if execution fails.
    `,
    inputSchema: z.object({
        sql: z.string(),
    }),
    execute: async ({ sql }) => {
        console.log('Executing SQL:', sql);
        const supabase = createClient();
        const { data, error } = await supabase
            .rpc('execute_any_sql', { p_sql: sql.replaceAll(';', '') }) // Remove semicolon to prevent syntax errors
        console.log('SQL execution result:', data, 'Error:', error)
        if (error) throw new Error(`SQL execution error: ${error.message}`)
        return data
    },
})