
// import { generateSQL } from './generateSQL';
// import { assessSQLSafety } from './assessSQLSafety';
// import { executeSQL } from './executeSQL';
// import { checkSQL } from './checkSQL';
import { generateSQL } from './generate-sql';
import { assessSQL } from './assess-sql';
import { executeSQL } from './execute-sql';
import { z } from 'zod';
import { tool, generateText, stepCountIs } from 'ai';
const systemPrompt = `
You are a SQL operations agent for a restaurant management system.
"Restaurants" are represented by the "organizations" table in the database. 

All queries you generate or execute MUST:
- include access control using organization_id, location_id, or user_id
- filter the data accordingly using those IDs in the WHERE clause
- avoid modifying data outside the authorized scope

Use the following tools as needed:
- generateSQL: to convert a user instruction into SQL
- assessSQL: to check if the SQL is safe to run and is valid
- executeSQL: to execute safe SQL queries and get results

Use this schema for reference:

---
CREATE TABLE public.menu_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  name character varying NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);

CREATE TABLE public.menu_item_locations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  menu_item_id uuid NOT NULL,
  location_id uuid NOT NULL,
  is_available boolean DEFAULT true,
  price_override numeric,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id),
  FOREIGN KEY (location_id) REFERENCES public.locations(id)
);

CREATE TABLE public.menu_item_variants (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  menu_item_id uuid NOT NULL,
  name character varying NOT NULL,
  price_modifier numeric DEFAULT 0,
  is_default boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id)
);

CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  category_id uuid,
  name character varying NOT NULL,
  description text,
  price numeric NOT NULL,
  cost_price numeric,
  image_url character varying,
  sku character varying,
  barcode character varying,
  preparation_time integer,
  calories integer,
  spice_level integer CHECK (spice_level >= 0 AND spice_level <= 5),
  dietary_tags ARRAY,
  allergen_info ARRAY,
  is_available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  gst_rate numeric DEFAULT 5.00,
  hsn_code character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  FOREIGN KEY (category_id) REFERENCES public.menu_categories(id)
);
---`;


export const menuManager = ({organization_id, location_id}: {organization_id: string, location_id?: string}) => tool({
    description: `
        Tool that can interpret and execute natural language instructions to manage restaurant menu-related data and returns the compiled result.
        It can take instructions to fetch or manipulate menu items, categories, and variants and availability.
        It ensures SQL safety, respects access control, and uses supporting tools to generate and execute queries.
    `,
    inputSchema: z.object({
        instruction: z.string().describe('Natural language instruction to manage menu items, categories, or variants'),
    }),
    execute: async ({ instruction }) => {
        console.log('Executing menuManager with instruction:', instruction);
        console.log('Organization ID:', organization_id);
        console.log('Location ID:', location_id);
        const result = await generateText({
            model: 'xai/grok-3',
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: instruction
                }
            ],
            tools: {
                generateSQL: generateSQL({organization_id, location_id}),
                executeSQL,
                assessSQL,
            },
            stopWhen: stepCountIs(5)
        });

        return result;
    }
});
