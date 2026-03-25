// app/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wwaovysvcsesahcltuai.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YW92eXN2Y3Nlc2FoY2x0dWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgxNDMsImV4cCI6MjA4NDYwNDE0M30.Ev5d1Dd_BDIsuRkMqWKnz6GQ2JMi26gIX4KC3eob-2w';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ANON_KEY
);

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ANON_KEY
  );
}
