import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          banner_image: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          price: string;
          raw_price: number;
          image: string;
          gallery: string[] | null;
          category: string;
          category_slug: string;
          badge: string | null;
          is_new: boolean | null;
          description: string | null;
          details: string[] | null;
          sizes: string[] | null;
          colors: string[] | null;
          fabric: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_user_id: string | null;
          customer_email_normalized: string;
          customer_phone: string | null;
          customer_address: string | null;
          postal_code: string | null;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          payment_status: 'pending' | 'submitted' | 'verified';
          payment_confirmation_token_hash: string | null;
          payment_submitted_at: string | null;
          payment_verified_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at' | 'customer_email_normalized'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string;
          quantity: number;
          price: number;
          size: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
    };
  };
};
