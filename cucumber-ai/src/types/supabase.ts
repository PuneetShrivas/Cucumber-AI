/* eslint-disable */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      customer_analytics: {
        Row: {
          average_spend_per_customer: number | null
          created_at: string | null
          date: string
          id: string
          loyalty_redemptions: number | null
          loyalty_signups: number | null
          new_customers: number | null
          organization_id: string
          returning_customers: number | null
          total_customers: number | null
        }
        Insert: {
          average_spend_per_customer?: number | null
          created_at?: string | null
          date: string
          id?: string
          loyalty_redemptions?: number | null
          loyalty_signups?: number | null
          new_customers?: number | null
          organization_id: string
          returning_customers?: number | null
          total_customers?: number | null
        }
        Update: {
          average_spend_per_customer?: number | null
          created_at?: string | null
          date?: string
          id?: string
          loyalty_redemptions?: number | null
          loyalty_signups?: number | null
          new_customers?: number | null
          organization_id?: string
          returning_customers?: number | null
          total_customers?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: Json | null
          anniversary_date: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          last_visit: string | null
          loyalty_points: number | null
          loyalty_tier: string | null
          organization_id: string
          phone: string | null
          preferences: Json | null
          total_spent: number | null
          total_visits: number | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          anniversary_date?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_visit?: string | null
          loyalty_points?: number | null
          loyalty_tier?: string | null
          organization_id: string
          phone?: string | null
          preferences?: Json | null
          total_spent?: number | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          anniversary_date?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_visit?: string | null
          loyalty_points?: number | null
          loyalty_tier?: string | null
          organization_id?: string
          phone?: string | null
          preferences?: Json | null
          total_spent?: number | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fssai_compliance: {
        Row: {
          assigned_to: string | null
          completion_date: string | null
          compliance_type: string
          created_at: string | null
          description: string | null
          documents: Json | null
          due_date: string | null
          id: string
          location_id: string | null
          organization_id: string
          status: string | null
        }
        Insert: {
          assigned_to?: string | null
          completion_date?: string | null
          compliance_type: string
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          due_date?: string | null
          id?: string
          location_id?: string | null
          organization_id: string
          status?: string | null
        }
        Update: {
          assigned_to?: string | null
          completion_date?: string | null
          compliance_type?: string
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          due_date?: string | null
          id?: string
          location_id?: string | null
          organization_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fssai_compliance_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fssai_compliance_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fssai_compliance_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_transactions: {
        Row: {
          cgst_amount: number | null
          cgst_rate: number | null
          created_at: string | null
          date: string
          gst_return_period: string | null
          id: string
          igst_amount: number | null
          igst_rate: number | null
          invoice_number: string | null
          is_filed: boolean | null
          order_id: string | null
          organization_id: string
          sgst_amount: number | null
          sgst_rate: number | null
          taxable_amount: number
          total_amount: number | null
          total_tax: number | null
          transaction_type: string
        }
        Insert: {
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          date: string
          gst_return_period?: string | null
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          invoice_number?: string | null
          is_filed?: boolean | null
          order_id?: string | null
          organization_id: string
          sgst_amount?: number | null
          sgst_rate?: number | null
          taxable_amount: number
          total_amount?: number | null
          total_tax?: number | null
          transaction_type: string
        }
        Update: {
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          date?: string
          gst_return_period?: string | null
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          invoice_number?: string | null
          is_filed?: boolean | null
          order_id?: string | null
          organization_id?: string
          sgst_amount?: number | null
          sgst_rate?: number | null
          taxable_amount?: number
          total_amount?: number | null
          total_tax?: number | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "gst_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string | null
          cost_per_unit: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          reorder_level: number | null
          reorder_quantity: number | null
          shelf_life_days: number | null
          storage_instructions: string | null
          supplier_info: Json | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          cost_per_unit?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          reorder_level?: number | null
          reorder_quantity?: number | null
          shelf_life_days?: number | null
          storage_instructions?: string | null
          supplier_info?: Json | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          cost_per_unit?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          reorder_level?: number | null
          reorder_quantity?: number | null
          shelf_life_days?: number | null
          storage_instructions?: string | null
          supplier_info?: Json | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_stock: {
        Row: {
          current_stock: number
          id: string
          inventory_item_id: string
          last_updated: string | null
          location_id: string
          reserved_stock: number
        }
        Insert: {
          current_stock?: number
          id?: string
          inventory_item_id: string
          last_updated?: string | null
          location_id: string
          reserved_stock?: number
        }
        Update: {
          current_stock?: number
          id?: string
          inventory_item_id?: string
          last_updated?: string | null
          location_id?: string
          reserved_stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_stock_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_stock_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: Json
          business_hours: Json | null
          contact_info: Json | null
          created_at: string | null
          delivery_radius: number | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          seating_capacity: number | null
          settings: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          address: Json
          business_hours?: Json | null
          contact_info?: Json | null
          created_at?: string | null
          delivery_radius?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          seating_capacity?: number | null
          settings?: Json | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          address?: Json
          business_hours?: Json | null
          contact_info?: Json | null
          created_at?: string | null
          delivery_radius?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          seating_capacity?: number | null
          settings?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          created_at: string | null
          customer_id: string
          description: string | null
          expiry_date: string | null
          id: string
          order_id: string | null
          points: number
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          order_id?: string | null
          points: number
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          order_id?: string | null
          points?: number
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_locations: {
        Row: {
          created_at: string | null
          id: string
          is_available: boolean | null
          location_id: string
          menu_item_id: string
          price_override: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          location_id: string
          menu_item_id: string
          price_override?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          location_id?: string
          menu_item_id?: string
          price_override?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_locations_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_variants: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_default: boolean | null
          menu_item_id: string
          name: string
          price_modifier: number | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_default?: boolean | null
          menu_item_id: string
          name: string
          price_modifier?: number | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_default?: boolean | null
          menu_item_id?: string
          name?: string
          price_modifier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_variants_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergen_info: string[] | null
          barcode: string | null
          calories: number | null
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          dietary_tags: string[] | null
          display_order: number | null
          gst_rate: number | null
          hsn_code: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          name: string
          organization_id: string
          preparation_time: number | null
          price: number
          sku: string | null
          spice_level: number | null
          updated_at: string | null
        }
        Insert: {
          allergen_info?: string[] | null
          barcode?: string | null
          calories?: number | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          dietary_tags?: string[] | null
          display_order?: number | null
          gst_rate?: number | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name: string
          organization_id: string
          preparation_time?: number | null
          price: number
          sku?: string | null
          spice_level?: number | null
          updated_at?: string | null
        }
        Update: {
          allergen_info?: string[] | null
          barcode?: string | null
          calories?: number | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          dietary_tags?: string[] | null
          display_order?: number | null
          gst_rate?: number | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name?: string
          organization_id?: string
          preparation_time?: number | null
          price?: number
          sku?: string | null
          spice_level?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_customizations: {
        Row: {
          additional_cost: number | null
          created_at: string | null
          customization_name: string
          id: string
          order_item_id: string
          variant_id: string | null
        }
        Insert: {
          additional_cost?: number | null
          created_at?: string | null
          customization_name: string
          id?: string
          order_item_id: string
          variant_id?: string | null
        }
        Update: {
          additional_cost?: number | null
          created_at?: string | null
          customization_name?: string
          id?: string
          order_item_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_customizations_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_customizations_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "menu_item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          menu_item_id: string
          order_id: string
          quantity: number
          special_instructions: string | null
          status: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_item_id: string
          order_id: string
          quantity: number
          special_instructions?: string | null
          status?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_item_id?: string
          order_id?: string
          quantity?: number
          special_instructions?: string | null
          status?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_prep_time: number | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          delivery_address: Json | null
          delivery_charge: number | null
          delivery_time: string | null
          discount_amount: number | null
          estimated_prep_time: number | null
          id: string
          location_id: string
          order_number: string
          order_source: string
          order_type: string
          organization_id: string
          payment_status: string
          special_instructions: string | null
          status: string
          subtotal: number
          table_id: string | null
          tax_amount: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          actual_prep_time?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_charge?: number | null
          delivery_time?: string | null
          discount_amount?: number | null
          estimated_prep_time?: number | null
          id?: string
          location_id: string
          order_number: string
          order_source: string
          order_type: string
          organization_id: string
          payment_status?: string
          special_instructions?: string | null
          status?: string
          subtotal: number
          table_id?: string | null
          tax_amount: number
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          actual_prep_time?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_charge?: number | null
          delivery_time?: string | null
          discount_amount?: number | null
          estimated_prep_time?: number | null
          id?: string
          location_id?: string
          order_number?: string
          order_source?: string
          order_type?: string
          organization_id?: string
          payment_status?: string
          special_instructions?: string | null
          status?: string
          subtotal?: number
          table_id?: string | null
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: Json | null
          business_hours: Json | null
          business_type: string
          contact_info: Json | null
          created_at: string | null
          fssai_license: string | null
          gst_number: string | null
          id: string
          name: string
          pan_number: string | null
          settings: Json | null
          slug: string
          subscription_plan: string
          subscription_status: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          business_hours?: Json | null
          business_type?: string
          contact_info?: Json | null
          created_at?: string | null
          fssai_license?: string | null
          gst_number?: string | null
          id?: string
          name: string
          pan_number?: string | null
          settings?: Json | null
          slug: string
          subscription_plan?: string
          subscription_status?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          business_hours?: Json | null
          business_type?: string
          contact_info?: Json | null
          created_at?: string | null
          fssai_license?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          pan_number?: string | null
          settings?: Json | null
          slug?: string
          subscription_plan?: string
          subscription_status?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          configuration: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          provider: string | null
          type: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          provider?: string | null
          type: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          provider?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          order_id: string
          payment_method_id: string
          processed_at: string | null
          processed_by: string | null
          status: string
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          order_id: string
          payment_method_id: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          order_id?: string
          payment_method_id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string
          is_optional: boolean | null
          menu_item_id: string
          quantity_required: number
          unit: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id: string
          is_optional?: boolean | null
          menu_item_id: string
          quantity_required: number
          unit: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string
          is_optional?: boolean | null
          menu_item_id?: string
          quantity_required?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          location_id: string
          position_x: number | null
          position_y: number | null
          qr_code: string | null
          seating_capacity: number
          table_name: string | null
          table_number: string
          table_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location_id: string
          position_x?: number | null
          position_y?: number | null
          qr_code?: string | null
          seating_capacity: number
          table_name?: string | null
          table_number: string
          table_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string
          position_x?: number | null
          position_y?: number | null
          qr_code?: string | null
          seating_capacity?: number
          table_name?: string | null
          table_number?: string
          table_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_analytics: {
        Row: {
          average_order_value: number | null
          created_at: string | null
          date: string
          hour: number | null
          id: string
          location_id: string | null
          order_sources: Json | null
          organization_id: string
          payment_methods: Json | null
          top_selling_items: Json | null
          total_orders: number
          total_revenue: number
          total_tax: number
        }
        Insert: {
          average_order_value?: number | null
          created_at?: string | null
          date: string
          hour?: number | null
          id?: string
          location_id?: string | null
          order_sources?: Json | null
          organization_id: string
          payment_methods?: Json | null
          top_selling_items?: Json | null
          total_orders?: number
          total_revenue?: number
          total_tax?: number
        }
        Update: {
          average_order_value?: number | null
          created_at?: string | null
          date?: string
          hour?: number | null
          id?: string
          location_id?: string | null
          order_sources?: Json | null
          organization_id?: string
          payment_methods?: Json | null
          top_selling_items?: Json | null
          total_orders?: number
          total_revenue?: number
          total_tax?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_analytics_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_attendance: {
        Row: {
          break_end: string | null
          break_start: string | null
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          date: string
          id: string
          location_id: string
          notes: string | null
          overtime_hours: number | null
          status: string | null
          total_hours: number | null
          user_id: string
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date: string
          id?: string
          location_id: string
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
          user_id: string
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date?: string
          id?: string
          location_id?: string
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_attendance_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_schedules: {
        Row: {
          break_duration: number | null
          created_at: string | null
          created_by: string | null
          id: string
          location_id: string
          role: string | null
          schedule_date: string
          shift_end: string
          shift_start: string
          status: string | null
          user_id: string
        }
        Insert: {
          break_duration?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location_id: string
          role?: string | null
          schedule_date: string
          shift_end: string
          shift_start: string
          status?: string | null
          user_id: string
        }
        Update: {
          break_duration?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location_id?: string
          role?: string | null
          schedule_date?: string
          shift_end?: string
          shift_start?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_schedules_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_schedules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_transactions: {
        Row: {
          batch_number: string | null
          created_at: string | null
          created_by: string | null
          expiry_date: string | null
          id: string
          inventory_item_id: string
          location_id: string
          notes: string | null
          quantity: number
          reference_id: string | null
          supplier_invoice: string | null
          total_cost: number | null
          transaction_type: string
          unit_cost: number | null
        }
        Insert: {
          batch_number?: string | null
          created_at?: string | null
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          inventory_item_id: string
          location_id: string
          notes?: string | null
          quantity: number
          reference_id?: string | null
          supplier_invoice?: string | null
          total_cost?: number | null
          transaction_type: string
          unit_cost?: number | null
        }
        Update: {
          batch_number?: string | null
          created_at?: string | null
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          inventory_item_id?: string
          location_id?: string
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          supplier_invoice?: string | null
          total_cost?: number | null
          transaction_type?: string
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      table_reservations: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          duration_minutes: number | null
          id: string
          location_id: string
          party_size: number
          reservation_date: string
          reservation_time: string
          special_requests: string | null
          status: string | null
          table_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          duration_minutes?: number | null
          id?: string
          location_id: string
          party_size: number
          reservation_date: string
          reservation_time: string
          special_requests?: string | null
          status?: string | null
          table_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          duration_minutes?: number | null
          id?: string
          location_id?: string
          party_size?: number
          reservation_date?: string
          reservation_time?: string
          special_requests?: string | null
          status?: string | null
          table_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_reservations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_reservations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          employee_id: string | null
          first_name: string | null
          hire_date: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          location_id: string | null
          organization_id: string | null
          permissions: Json | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          employee_id?: string | null
          first_name?: string | null
          hire_date?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          location_id?: string | null
          organization_id?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          employee_id?: string | null
          first_name?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          location_id?: string | null
          organization_id?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          location_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          location_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          location_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
