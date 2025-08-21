import { tool } from 'ai';
import { z } from 'zod';
export const displayView =() => tool({
    name: 'displayView',
    description: `
Use this tool to display a specific view in the application when you have updated the data for menu, kitchen, customers, or other relevant sections.
This tool will trigger the frontend to switch to the appropriate view based on the provided parameters.
  `,
    inputSchema: z.object({
        view: z.string().describe('The view to display, e.g., "menu", "kitchen", etc.'),
    }),
    execute: async ({ view }) => {
        console.log('Displaying view:', view);
        // Trigger the frontend to switch to the appropriate view
        return {
            success: true,
            view,
        };
    },
});