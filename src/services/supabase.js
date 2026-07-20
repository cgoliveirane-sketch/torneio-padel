import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "As variáveis do Supabase não foram configuradas."
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, name")
    .limit(1);

  if (error) {
    throw error;
  }

  return data;
}