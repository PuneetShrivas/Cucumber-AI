import { schema } from "prosemirror-schema-basic";

export const schemas = [
  {
    table: 'organizations',
    description: `Table containing details about the restaurant. Organizations are referred to as restaurants in the system.
Links to the owner by user_id.`,
    schema: `CREATE TABLE public.organizations (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
name character varying NOT NULL,
slug character varying NOT NULL UNIQUE,
business_type character varying NOT NULL DEFAULT 'restaurant'::character varying,
subscription_plan character varying NOT NULL DEFAULT 'basic'::character varying,
subscription_status character varying NOT NULL DEFAULT 'active'::character varying,
gst_number character varying,
fssai_license character varying,
pan_number character varying,
address jsonb,
contact_info jsonb,
business_hours jsonb,
timezone character varying DEFAULT 'Asia/Kolkata'::character varying,
settings jsonb DEFAULT '{}'::jsonb,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
owner_id uuid NOT NULL,
CONSTRAINT organizations_pkey PRIMARY KEY (id),
CONSTRAINT organizations_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);`,
  },
  {
    table: 'locations',
    description: `Table containing details about the restaurant locations. A restaurant can have multiple locations.
Links to the organization by organization_id.`,
    schema: `CREATE TABLE public.locations (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
name character varying NOT NULL,
type character varying NOT NULL DEFAULT 'dine_in'::character varying,
address jsonb NOT NULL,
contact_info jsonb,
business_hours jsonb,
seating_capacity integer,
delivery_radius integer,
is_active boolean DEFAULT true,
settings jsonb DEFAULT '{}'::jsonb,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT locations_pkey PRIMARY KEY (id),
CONSTRAINT locations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);`,
  },
  {
    table: 'customer_analytics',
    description: `Table storing daily customer analytics data for each organization, including new and returning customers, total customers, average spend, and loyalty program signups/redemptions.`,
    schema: `CREATE TABLE public.customer_analytics (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
date date NOT NULL,
new_customers integer DEFAULT 0,
returning_customers integer DEFAULT 0,
total_customers integer DEFAULT 0,
average_spend_per_customer numeric,
loyalty_signups integer DEFAULT 0,
loyalty_redemptions integer DEFAULT 0,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT customer_analytics_pkey PRIMARY KEY (id),
CONSTRAINT customer_analytics_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);`,
  },
  {
    table: 'customers',
    description: `Table storing customer profiles, including personal information, preferences, and loyalty program details.
Links to the organization by organization_id.`,
    schema: `CREATE TABLE public.customers (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
phone character varying UNIQUE,
email character varying,
first_name character varying,
last_name character varying,
date_of_birth date,
anniversary_date date,
gender character varying,
address jsonb,
preferences jsonb,
loyalty_points integer DEFAULT 0,
loyalty_tier character varying DEFAULT 'bronze'::character varying,
total_visits integer DEFAULT 0,
total_spent numeric DEFAULT 0,
last_visit timestamp with time zone,
is_active boolean DEFAULT true,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT customers_pkey PRIMARY KEY (id),
CONSTRAINT customers_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);`,
  },
  {
    table: 'fssai_compliance',
    description: `Table for tracking FSSAI compliance tasks and their status for organizations and locations.
Links to the organization by organization_id, location by location_id, and assigned user by assigned_to.`,
    schema: `CREATE TABLE public.fssai_compliance (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
location_id uuid,
compliance_type character varying NOT NULL,
description text,
due_date date,
completion_date date,
status character varying DEFAULT 'pending'::character varying,
assigned_to uuid,
documents jsonb,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT fssai_compliance_pkey PRIMARY KEY (id),
CONSTRAINT fssai_compliance_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
CONSTRAINT fssai_compliance_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id),
CONSTRAINT fssai_compliance_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.user_profiles(id)
);`,
  },
  {
    table: 'gst_transactions',
    description: `Table to record GST-related financial transactions for organizations, including details like taxable amounts, GST components, and return periods.
Links to the organization by organization_id and order by order_id.`,
    schema: `CREATE TABLE public.gst_transactions (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
order_id uuid,
transaction_type character varying NOT NULL,
invoice_number character varying,
date date NOT NULL,
taxable_amount numeric NOT NULL,
cgst_rate numeric,
cgst_amount numeric,
sgst_rate numeric,
sgst_amount numeric,
igst_rate numeric,
igst_amount numeric,
total_tax numeric,
total_amount numeric,
gst_return_period character varying,
is_filed boolean DEFAULT false,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT gst_transactions_pkey PRIMARY KEY (id),
CONSTRAINT gst_transactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
CONSTRAINT gst_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);`,
  },
  {
    table: 'inventory_items',
    description: `Table for managing individual inventory items, including their descriptions, categories, reorder levels, and supplier information.
Links to the organization by organization_id.`,
    schema: `CREATE TABLE public.inventory_items (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
name character varying NOT NULL,
description text,
category character varying,
unit character varying NOT NULL,
reorder_level numeric,
reorder_quantity numeric,
cost_per_unit numeric,
supplier_info jsonb,
storage_instructions text,
shelf_life_days integer,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT inventory_items_pkey PRIMARY KEY (id),
CONSTRAINT inventory_items_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);`,
  },
  {
    table: 'inventory_stock',
    description: `Table to track the current stock levels of inventory items at specific locations.
Links to the inventory item by inventory_item_id and location by location_id.`,
    schema: `CREATE TABLE public.inventory_stock (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
inventory_item_id uuid NOT NULL,
location_id uuid NOT NULL,
current_stock numeric NOT NULL DEFAULT 0,
reserved_stock numeric NOT NULL DEFAULT 0,
last_updated timestamp with time zone DEFAULT now(),
CONSTRAINT inventory_stock_pkey PRIMARY KEY (id),
CONSTRAINT inventory_stock_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(id),
CONSTRAINT inventory_stock_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id)
);`,
  },
  {
    table: 'loyalty_transactions',
    description: `Table to record loyalty point transactions for customers, including points earned or redeemed, and their expiry.
Links to the customer by customer_id and order by order_id.`,
    schema: `CREATE TABLE public.loyalty_transactions (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
customer_id uuid NOT NULL,
order_id uuid,
transaction_type character varying NOT NULL,
points integer NOT NULL,
description text,
expiry_date date,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT loyalty_transactions_pkey PRIMARY KEY (id),
CONSTRAINT loyalty_transactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);`,
  },
  {
    table: 'menu_categories',
    description: `Table for organizing menu items into categories.
Links to the organization by organization_id.`,
    schema: `CREATE TABLE public.menu_categories (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
name character varying NOT NULL,
description text,
display_order integer DEFAULT 0,
is_active boolean DEFAULT true,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT menu_categories_pkey PRIMARY KEY (id),
CONSTRAINT menu_categories_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);`,
  },
  {
    table: 'menu_item_locations',
    description: `Table linking menu items to specific locations, allowing for availability and price overrides per location.
Links to the menu item by menu_item_id and location by location_id.`,
    schema: `CREATE TABLE public.menu_item_locations (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
menu_item_id uuid NOT NULL,
location_id uuid NOT NULL,
is_available boolean DEFAULT true,
price_override numeric,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT menu_item_locations_pkey PRIMARY KEY (id),
CONSTRAINT menu_item_locations_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id),
CONSTRAINT menu_item_locations_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id)
);`,
  },
  {
    table: 'menu_item_variants',
    description: `Table for defining different variations of a menu item, such as size or flavor, and their price modifiers.
Links to the menu item by menu_item_id.`,
    schema: `CREATE TABLE public.menu_item_variants (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
menu_item_id uuid NOT NULL,
name character varying NOT NULL,
price_modifier numeric DEFAULT 0,
is_default boolean DEFAULT false,
display_order integer DEFAULT 0,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT menu_item_variants_pkey PRIMARY KEY (id),
CONSTRAINT menu_item_variants_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id)
);`,
  },
  {
    table: 'menu_items',
    description: `Table storing details about individual menu items, including pricing, images, dietary information, and availability.
Links to the organization by organization_id and menu category by category_id.`,
    schema: `CREATE TABLE public.menu_items (
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
CONSTRAINT menu_items_pkey PRIMARY KEY (id),
CONSTRAINT menu_items_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.menu_categories(id)
);`,
  },
  {
    table: 'order_item_customizations',
    description: `Table to store customizations applied to specific items within an order, such as variant selections or additional costs.
Links to the order item by order_item_id and menu item variant by variant_id.`,
    schema: `CREATE TABLE public.order_item_customizations (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
order_item_id uuid NOT NULL,
variant_id uuid,
customization_name character varying NOT NULL,
additional_cost numeric DEFAULT 0,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT order_item_customizations_pkey PRIMARY KEY (id),
CONSTRAINT order_item_customizations_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id),
CONSTRAINT order_item_customizations_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.menu_item_variants(id)
);`,
  },
  {
    table: 'order_items',
    description: `Table detailing each item included in an order, along with its quantity, price, and special instructions.
Links to the order by order_id and menu item by menu_item_id.`,
    schema: `CREATE TABLE public.order_items (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
order_id uuid NOT NULL,
menu_item_id uuid NOT NULL,
quantity integer NOT NULL,
unit_price numeric NOT NULL,
total_price numeric NOT NULL,
special_instructions text,
status character varying DEFAULT 'pending'::character varying,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT order_items_pkey PRIMARY KEY (id),
CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
CONSTRAINT order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id)
);`,
  },
  {
    table: 'orders',
    description: `Table for storing comprehensive order details, including customer information, total amounts, and statuses.
Links to the organization by organization_id, location by location_id, customer by customer_id, restaurant table by table_id, and user profile by created_by.`,
    schema: `CREATE TABLE public.orders (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
location_id uuid NOT NULL,
order_number character varying NOT NULL,
customer_id uuid,
table_id uuid,
order_type character varying NOT NULL,
order_source character varying NOT NULL,
status character varying NOT NULL DEFAULT 'pending'::character varying,
payment_status character varying NOT NULL DEFAULT 'pending'::character varying,
subtotal numeric NOT NULL,
tax_amount numeric NOT NULL,
discount_amount numeric DEFAULT 0,
delivery_charge numeric DEFAULT 0,
total_amount numeric NOT NULL,
delivery_address jsonb,
delivery_time timestamp with time zone,
special_instructions text,
estimated_prep_time integer,
actual_prep_time integer,
created_by uuid,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT orders_pkey PRIMARY KEY (id),
CONSTRAINT orders_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
CONSTRAINT orders_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id),
CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
CONSTRAINT orders_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.restaurant_tables(id),
CONSTRAINT orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id)
);`,
  },
  {
    table: 'payment_methods',
    description: `Table to define and configure various payment methods available for an organization.
Links to the organization by organization_id.`,
    schema: `CREATE TABLE public.payment_methods (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
name character varying NOT NULL,
type character varying NOT NULL,
provider character varying,
configuration jsonb,
is_active boolean DEFAULT true,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT payment_methods_pkey PRIMARY KEY (id),
CONSTRAINT payment_methods_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);`,
  },
  {
    table: 'payment_transactions',
    description: `Table for logging individual payment transactions, including amounts, statuses, and gateway details.
Links to the order by order_id, payment method by payment_method_id, and user profile by processed_by.`,
    schema: `CREATE TABLE public.payment_transactions (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
order_id uuid NOT NULL,
payment_method_id uuid NOT NULL,
amount numeric NOT NULL,
transaction_type character varying NOT NULL,
status character varying NOT NULL DEFAULT 'pending'::character varying,
gateway_transaction_id character varying,
gateway_response jsonb,
processed_by uuid,
processed_at timestamp with time zone DEFAULT now(),
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT payment_transactions_pkey PRIMARY KEY (id),
CONSTRAINT payment_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
CONSTRAINT payment_transactions_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id),
CONSTRAINT payment_transactions_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.user_profiles(id)
);`,
  },
  {
    table: 'profiles',
    description: `Table for general user profiles, extending the authentication users table.`,
    schema: `CREATE TABLE public.profiles (
id uuid NOT NULL,
type text NOT NULL DEFAULT 'regular'::text CHECK (type = ANY (ARRAY['guest'::text, 'regular'::text])),
CONSTRAINT profiles_pkey PRIMARY KEY (id),
CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);`,
  },
  {
    table: 'recipes',
    description: `Table detailing the ingredients (inventory items) and quantities required for each menu item.
Links to the menu item by menu_item_id and inventory item by inventory_item_id.`,
    schema: `CREATE TABLE public.recipes (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
menu_item_id uuid NOT NULL,
inventory_item_id uuid NOT NULL,
quantity_required numeric NOT NULL,
unit character varying NOT NULL,
is_optional boolean DEFAULT false,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT recipes_pkey PRIMARY KEY (id),
CONSTRAINT recipes_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id),
CONSTRAINT recipes_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(id)
);`,
  },
  {
    table: 'restaurant_tables',
    description: `Table for managing restaurant tables, including their capacity, location within a venue, and QR code information.
Links to the location by location_id.`,
    schema: `CREATE TABLE public.restaurant_tables (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
location_id uuid NOT NULL,
table_number character varying NOT NULL,
table_name character varying,
seating_capacity integer NOT NULL,
table_type character varying DEFAULT 'regular'::character varying,
position_x integer,
position_y integer,
qr_code character varying,
is_active boolean DEFAULT true,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT restaurant_tables_pkey PRIMARY KEY (id),
CONSTRAINT restaurant_tables_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id)
);`,
  },
  {
    table: 'sales_analytics',
    description: `Table for storing aggregated sales data, providing insights into total revenue, top-selling items, and order sources.
Links to the organization by organization_id and location by location_id.`,
    schema: `CREATE TABLE public.sales_analytics (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
organization_id uuid NOT NULL,
location_id uuid,
date date NOT NULL,
hour integer,
total_orders integer NOT NULL DEFAULT 0,
total_revenue numeric NOT NULL DEFAULT 0,
total_tax numeric NOT NULL DEFAULT 0,
average_order_value numeric,
top_selling_items jsonb,
order_sources jsonb,
payment_methods jsonb,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT sales_analytics_pkey PRIMARY KEY (id),
CONSTRAINT sales_analytics_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
CONSTRAINT sales_analytics_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id)
);`,
  },
  {
    table: 'staff_attendance',
    description: `Table to record staff clock-in and clock-out times, breaks, and calculate total working hours.
Links to the user profile by user_id and location by location_id.`,
    schema: `CREATE TABLE public.staff_attendance (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
user_id uuid NOT NULL,
location_id uuid NOT NULL,
date date NOT NULL,
clock_in time without time zone,
clock_out time without time zone,
break_start time without time zone,
break_end time without time zone,
total_hours numeric,
overtime_hours numeric DEFAULT 0,
status character varying DEFAULT 'present'::character varying,
notes text,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT staff_attendance_pkey PRIMARY KEY (id),
CONSTRAINT staff_attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id),
CONSTRAINT staff_attendance_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id)
);`,
  },
  {
    table: 'staff_schedules',
    description: `Table for managing staff work schedules, including shifts, roles, and assigned locations.
Links to the user profile by user_id, location by location_id, and created by user by created_by.`,
    schema: `CREATE TABLE public.staff_schedules (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
user_id uuid NOT NULL,
location_id uuid NOT NULL,
schedule_date date NOT NULL,
shift_start time without time zone NOT NULL,
shift_end time without time zone NOT NULL,
break_duration integer DEFAULT 30,
role character varying,
status character varying DEFAULT 'scheduled'::character varying,
created_by uuid,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT staff_schedules_pkey PRIMARY KEY (id),
CONSTRAINT staff_schedules_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id),
CONSTRAINT staff_schedules_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id),
CONSTRAINT staff_schedules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id)
);`,
  },
  {
    table: 'stock_transactions',
    description: `Table to log all movements and adjustments of inventory stock, such as receipts, issues, and transfers.
Links to the inventory item by inventory_item_id, location by location_id, and user profile by created_by.`,
    schema: `CREATE TABLE public.stock_transactions (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
inventory_item_id uuid NOT NULL,
location_id uuid NOT NULL,
transaction_type character varying NOT NULL,
quantity numeric NOT NULL,
unit_cost numeric,
total_cost numeric,
batch_number character varying,
expiry_date date,
supplier_invoice character varying,
reference_id uuid,
notes text,
created_by uuid,
created_at timestamp with time zone DEFAULT now(),
CONSTRAINT stock_transactions_pkey PRIMARY KEY (id),
CONSTRAINT stock_transactions_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(id),
CONSTRAINT stock_transactions_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id),
CONSTRAINT stock_transactions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id)
);`,
  },
  {
    table: 'table_reservations',
    description: `Table for managing customer reservations for restaurant tables, including party size, date, and time.
Links to the location by location_id, restaurant table by table_id, and user profile by created_by.`,
    schema: `CREATE TABLE public.table_reservations (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
location_id uuid NOT NULL,
table_id uuid,
customer_name character varying NOT NULL,
customer_phone character varying,
customer_email character varying,
party_size integer NOT NULL,
reservation_date date NOT NULL,
reservation_time time without time zone NOT NULL,
duration_minutes integer DEFAULT 120,
status character varying DEFAULT 'confirmed'::character varying,
special_requests text,
created_by uuid,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT table_reservations_pkey PRIMARY KEY (id),
CONSTRAINT table_reservations_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id),
CONSTRAINT table_reservations_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.restaurant_tables(id),
CONSTRAINT table_reservations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id)
);`,
  },
  {
    table: 'user_profiles',
    description: `Table containing additional profile information for users, linked to the authentication system.
Links to the organization by organization_id and location by location_id.`,
    schema: `CREATE TABLE public.user_profiles (
id uuid NOT NULL,
organization_id uuid,
location_id uuid,
email character varying NOT NULL UNIQUE,
first_name character varying,
last_name character varying,
phone character varying,
role character varying NOT NULL DEFAULT 'staff'::character varying,
permissions jsonb DEFAULT '{}'::jsonb,
employee_id character varying,
hire_date date,
is_active boolean DEFAULT true,
last_login timestamp with time zone,
created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
CONSTRAINT user_profiles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
CONSTRAINT user_profiles_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id)
);`,
  },
  {
    table: 'user_sessions',
    description: `Table to track user login sessions, including device information and IP address.
Links to the user profile by user_id and location by location_id.`,
    schema: `CREATE TABLE public.user_sessions (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
user_id uuid NOT NULL,
location_id uuid,
device_info jsonb,
ip_address inet,
is_active boolean DEFAULT true,
created_at timestamp with time zone DEFAULT now(),
expires_at timestamp with time zone,
CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id),
CONSTRAINT user_sessions_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id)
);`,
  },
];

export const tableDescriptionsString = schemas.map((s) => `- ${s.table}: ${s.description}`).join('\n');

//function that takes array of table names and returns all schemas in one string
export const getSchemasForTables = (tableNames: string[]) => {
    return tableNames.map((tableName: string) => {
        const schema = schemas.find(s => s.table === tableName);
        return schema ? 'Schema for table named ' + tableName + ': ' + schema.schema : '';
    }).join('\n');
};