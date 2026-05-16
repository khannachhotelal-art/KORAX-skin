import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://untgdpyoepvzxuzrgtyg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tBwzkEw4CyJKRz7GVO2WBQ_Ovxn49Fo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
