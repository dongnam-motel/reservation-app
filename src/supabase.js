import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qjrujlohkglfmghctiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcnVqbG9oa2dsZm1naGN0aXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDg0ODQsImV4cCI6MjA1OTg4NDQ4NH0.lZHhfPjZ_CI6ERPjXvcf8657GcBraULMmAAIMfFzXms';

export const supabase = createClient(supabaseUrl, supabaseKey);
