import { generateText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import {dbSchemaPrompt} from '@/lib/chatbot/ai/prompts';
export const getOrganizationDetails = tool({
    description: 'Get details of an organization by its id',
    inputSchema: z.object({
        id: z.string(),
    }),
    execute: async ({ id }) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error(`Error fetching organization: ${error.message}`);
        }

        return data;
    },
});

/**
 * 1️⃣ SQL Generator
 *   - Input: { request: NL‑string }
 *   - Output: a valid SQL string (SELECT/INSERT/UPDATE/DELETE/UPSERT)
 */
export const generateSQL = tool({
    description: `
    Given a user’s natural‑language request and the known schema,
    output exactly the SQL statement needed (no commentary).
    E.g. "list active customers in Chicago" → 
         "SELECT * FROM customers WHERE is_active = true AND (address->>'city') = 'Chicago';"
  `,
    inputSchema: z.object({
        request: z.string(),
    }),
    execute: async ({ request }) => {
        // This is a pass‑through stub. The AI model itself, using its system prompt,
        // will fill in the actual SQL here.
        return request
    },
})

/**
 * 2️⃣ SQL Executor
 *   - Input: { sql: string }
 *   - Output: the result set or error from Supabase
 */
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

/**
 * 3️⃣ SQL Safety Assessor
 *   - Input: { sql: string }
 *   - Output: { risk: 'low' | 'medium' | 'high', reasons: string[] }
 *
 *  Checks for dangerous patterns (e.g. DROP, DELETE without WHERE,
 *  bulk UPDATE, or missing LIMIT) and flags risk accordingly.
 */
export const assessSQLSafety = tool({
    description: `
    Analyze the given SQL string and return a risk level:
    - low: safe to run (SELECT only, has LIMIT or WHERE for mutations)
    - medium: cautious (UPDATE/DELETE but has WHERE/LIMIT)
    - high: dangerous (DROP, TRUNCATE, DELETE/UPDATE without WHERE/LIMIT, etc.)
    Also list the reasons.
  `,
    inputSchema: z.object({
        sql: z.string(),
    }),
    execute: async ({ sql }) => {
        const reasons: string[] = []
        const up = sql.toUpperCase()

        if (/\\b(DROP|TRUNCATE)\\b/.test(up)) {
            reasons.push('Contains DROP or TRUNCATE')
        }
        if (/\\bDELETE\\b/.test(up) && !/WHERE/.test(up)) {
            reasons.push('DELETE without WHERE')
        }
        if (/\\bUPDATE\\b/.test(up) && !/WHERE/.test(up)) {
            reasons.push('UPDATE without WHERE')
        }
        if (/\\bSELECT\\b/.test(up) && !/LIMIT\\b/.test(up) && /\\bSELECT\\s+\\*/.test(up)) {
            reasons.push('SELECT * without LIMIT')
        }

        let risk: 'low' | 'medium' | 'high' = 'low'
        if (reasons.length > 0) {
            // any DROP/TRUNCATE or unscoped mutation → high
            if (reasons.some(r => /DROP|TRUNCATE|without WHERE/.test(r))) {
                risk = 'high'
            } else {
                risk = 'medium'
            }
        }

        return { risk, reasons }
    },
})

export const checkSQLStatement = tool({
    description: `
    Check if the SQL statement is valid and uses actual tables/columns from the schema.
    - Input: { sql: string }
    - Output: { response: string }
  `,
    inputSchema: z.object({
        sql: z.string(),
    }),
    execute: async ({ sql }) => {
        // This is a placeholder for actual validation logic
        if (!sql.trim()) {
            return { response: 'SQL statement cannot be empty.' }
        }
        const prompt = `You are a SQL validator. Check the following SQL statement for validity and correctness:\n\n${sql}\n\nIs this a valid SQL statement?
        Respond with "yes" or "no". If no, explain why.
        SQL rules: 
        - Must use actual tables and columns from the schema.
        - Must not contain any syntax errors.
        - Must not contain ; for SQL termination.
        Schema: ${dbSchemaPrompt}
        `;
        const result = await generateText({
            model: 'xai/grok-3',
            messages: [{ role: 'user', content: prompt }]
        })
        return ({ response: result.text });
    }
});