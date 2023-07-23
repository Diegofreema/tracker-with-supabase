import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};
// no need for an env file since this is just for testing
const supabaseUrl = 'https://sfjgylzjctrjotplkmao.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmamd5bHpqY3Ryam90cGxrbWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAwNzE0ODIsImV4cCI6MjAwNTY0NzQ4Mn0.Vmq1hWxj8s5r_nigeWWkKuJ9iwkdItwvvlQFuryIKls';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
