import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  if (typeof import.meta !== 'undefined' && import.meta.env) return (import.meta.env as any)[key];
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://jkyxajnlhlwfftgplwii.supabase.co';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreXhham5saGx3ZmZ0Z3Bsd2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTQ1NjUsImV4cCI6MjEwMDk5MDU2NX0.VQ5c6rUogRDfpjHyLB275NkQy3CYK12gRD2ncLVFcTQ';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
