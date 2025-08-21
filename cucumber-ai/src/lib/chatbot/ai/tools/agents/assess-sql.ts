import { tool, generateText } from 'ai';
import { z } from 'zod';
export const assessSQL = tool({
    description: `
        Performs a comprehensive assessment of a SQL statement, checking both safety and validity.
        - Takes in a SQL string and a schema definition
        - Validates the SQL syntax and schema alignment
        - Evaluates safety risks (DROP, TRUNCATE, unscoped DELETE/UPDATE, etc.)
        - Returns combined assessment results
    `,
    inputSchema: z.object({
        sql: z.string(),
        schema: z.string().describe('Database schema information to validate against'),
    }),
    execute: async ({ sql, schema }) => {
        // Safety assessment
        const reasons: string[] = [];
        const up = sql.toUpperCase();

        if (/\b(DROP|TRUNCATE)\b/.test(up)) {
            reasons.push('Contains DROP or TRUNCATE');
        }
        if (/\bDELETE\b/.test(up) && !/WHERE/.test(up)) {
            reasons.push('DELETE without WHERE');
        }
        if (/\bUPDATE\b/.test(up) && !/WHERE/.test(up)) {
            reasons.push('UPDATE without WHERE');
        }
        if (/\bSELECT\b/.test(up) && !/LIMIT\b/.test(up) && /\bSELECT\s+\*/.test(up)) {
            reasons.push('SELECT * without LIMIT');
        }

        let risk: 'low' | 'medium' | 'high' = 'low';
        if (reasons.length > 0) {
            // Any DROP/TRUNCATE or unscoped mutation → high
            if (reasons.some(r => /DROP|TRUNCATE|without WHERE/.test(r))) {
                risk = 'high';
            } else {
                risk = 'medium';
            }
        }
        console.log('SQL Safety Assessment:', { risk, reasons });
        // Validity check
        if (!sql.trim()) {
            return { 
                safety: { risk, reasons },
                validity: { isValid: false, message: 'SQL statement cannot be empty.' }
            };
        }

        const prompt = `You are a SQL validator. Check the following SQL statement for validity and correctness:

    ${sql}

    Given the schema: ${schema}

    Is this a valid SQL statement? Consider:
    - Must use actual tables and columns from the schema
    - Must not contain any syntax errors
    - Must not contain ; for SQL termination

    Return only "valid" or "invalid" followed by the reason.`;
        
        const result = await generateText({
            model: 'xai/grok-3',
            messages: [{ role: 'user', content: prompt }]
        });

        const validityResponse = result.text.trim();
        const isValid = validityResponse.toLowerCase().includes('valid') && 
                !validityResponse.toLowerCase().includes('invalid');
        const validityMessage = validityResponse;
        
        console.log('SQL Validity Assessment:', { isValid, validityMessage });
        
        return {
            safety: { risk, reasons },
            validity: { isValid, message: validityMessage }
        };
    }
});