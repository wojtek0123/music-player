import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;

export const supabase = createClient<Database>(VITE_SUPABASE_URL ?? "", VITE_SUPABASE_KEY ?? "");
