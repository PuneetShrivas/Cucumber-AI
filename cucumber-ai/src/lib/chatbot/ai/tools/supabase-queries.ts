import { generateText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
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