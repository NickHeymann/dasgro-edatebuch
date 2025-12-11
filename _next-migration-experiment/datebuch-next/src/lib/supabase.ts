import { createBrowserClient } from '@supabase/ssr';

// Supabase Client für Browser
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Database Types (generiert von Supabase)
export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          emoji: string;
          title: string;
          date: string;
          end_date: string | null;
          category: string;
          description: string | null;
          location: string | null;
          address: string | null;
          coords: number[] | null;
          link: string | null;
          time: string | null;
          price: string | null;
          vorher_nachher: string | null;
          restaurant: Record<string, unknown> | null;
          bar: Record<string, unknown> | Record<string, unknown>[] | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          liked: boolean;
          disliked: boolean;
          rating: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ratings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>;
      };
      date_history: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          title: string;
          emoji: string;
          category: string;
          rating: number;
          notes: string | null;
          photos: string[] | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['date_history']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['date_history']['Insert']>;
      };
      love_letters: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          text: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['love_letters']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['love_letters']['Insert']>;
      };
      bucket_list: {
        Row: {
          id: string;
          user_id: string;
          emoji: string;
          text: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bucket_list']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['bucket_list']['Insert']>;
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          category: string;
          description: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>;
      };
      destinations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          country: string;
          lat: number;
          lon: number;
          status: 'visited' | 'wishlist';
          visit_date: string | null;
          diary: string | null;
          photos: string[] | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['destinations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['destinations']['Insert']>;
      };
      couple_sync: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          status: 'pending' | 'active';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['couple_sync']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['couple_sync']['Insert']>;
      };
    };
  };
};
