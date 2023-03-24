import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { SUPABASE_STORAGE_KEY } from "../config/constants";
import { Database } from "./database.types";

export const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
export const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient<Database>(
  supabaseUrl ?? "",
  supabaseAnonKey ?? "",
  {
    auth: {
      storage: AsyncStorage as any,
      storageKey: SUPABASE_STORAGE_KEY,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return {
    session: data.session,
  };
};

export const getProducts = async (query: string) => {
  return await supabase.from("products").select(`*`);
};

type ProductResponse = Awaited<ReturnType<typeof getProducts>>;
export type ProductResponseSuccess = ProductResponse["data"];
export type ProductResponseError = ProductResponse["error"];
