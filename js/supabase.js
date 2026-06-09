import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase configuration
const SUPABASE_URL = 'https://gvkvhnedfvvbuuuvuekn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XzSItVsmF6BXK3Uxm6rKiQ_maO2zIqo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);