/*
  Supabase setup for Autocar admin:

  1. Create a public storage bucket named `car-images`.

  2. Run this SQL in Supabase SQL Editor:

     create extension if not exists "pgcrypto";

     create table if not exists public.cars (
       id uuid primary key default gen_random_uuid(),
       name text not null,
       brand text not null,
       year integer not null,
       price text not null,
       description text not null,
       images text[] not null default '{}',
       status text not null default 'active',
       created_at timestamptz not null default now()
     );

  3. Allow table access for anon + authenticated roles:

     alter table public.cars enable row level security;

     create policy "cars_select_all"
       on public.cars for select
       to anon, authenticated
       using (true);

     create policy "cars_insert_all"
       on public.cars for insert
       to anon, authenticated
       with check (true);

     create policy "cars_update_all"
       on public.cars for update
       to anon, authenticated
       using (true)
       with check (true);

     create policy "cars_delete_all"
       on public.cars for delete
       to anon, authenticated
       using (true);

  4. Allow storage access for the `car-images` bucket:

     create policy "car_images_select_all"
       on storage.objects for select
       to anon, authenticated
       using (bucket_id = 'car-images');

     create policy "car_images_insert_all"
       on storage.objects for insert
       to anon, authenticated
       with check (bucket_id = 'car-images');

     create policy "car_images_update_all"
       on storage.objects for update
       to anon, authenticated
       using (bucket_id = 'car-images')
       with check (bucket_id = 'car-images');

     create policy "car_images_delete_all"
       on storage.objects for delete
       to anon, authenticated
       using (bucket_id = 'car-images');
*/

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const CAR_IMAGES_BUCKET = "car-images";

export type Database = {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string;
          name: string;
          brand: string;
          year: number;
          price: string;
          description: string;
          images: string[];
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand: string;
          year: number;
          price: string;
          description: string;
          images: string[];
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string;
          year?: number;
          price?: string;
          description?: string;
          images?: string[];
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type CarRecord = Database["public"]["Tables"]["cars"]["Row"];

type SupabaseCredentials = {
  url: string;
  anonKey: string;
};

let browserClient: SupabaseClient<Database> | null = null;

function getSupabaseCredentials(): SupabaseCredentials | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

function createSupabaseOptions() {
  return {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  };
}

export function hasSupabaseEnv() {
  return getSupabaseCredentials() !== null;
}

export function createSupabaseServerClient() {
  const credentials = getSupabaseCredentials();

  if (!credentials) {
    return null;
  }

  return createClient<Database>(credentials.url, credentials.anonKey, createSupabaseOptions());
}

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    return null;
  }

  const credentials = getSupabaseCredentials();

  if (!credentials) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient<Database>(
      credentials.url,
      credentials.anonKey,
      createSupabaseOptions()
    );
  }

  return browserClient;
}
