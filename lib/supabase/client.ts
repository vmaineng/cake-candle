import { createClient } from '@supabase/supabase-js';
import { Database} from '../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession:true,
        autoRefreshToken:true,
        detectSessionInUrl:true,
    },
    realtime: {
        params: {
            eventsPerSecond:10
        }
    }
});

export const getCurrentUser = async () => {
    const {data: {user}} = await supabase.auth.getUser();
    return user;
}

export const getUserProfile = async(UserId: string) => {
    const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', UserId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return data;
}