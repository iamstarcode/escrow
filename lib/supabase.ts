import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Env } from "../config/env";
import { SUPABASE_STORAGE_KEY } from "../config/constants";
import { Database } from "./database.types";

export const supabase = createClient<Database>(
  Env.SUPABASE_URL ?? "",
  Env.SUPABASE_ANON_KEY ?? "",
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

export const getProducts = async () =>
  supabase
    .from("products")
    .select(`*`)
    .eq("can_edit", true)
    .then((res) => res);

export const getSingleProduct = async (args: any) =>
  supabase
    .from("products")
    .select(`*`)
    .eq("id", args[1])
    .eq("can_edit", args[2])
    .single()
    .then((res) => res);

type ProductSeResponse = Awaited<ReturnType<typeof getSingleProduct>>;
export type ProductResponseSuccess = ProductSeResponse["data"];

type ProductsRsesponse = Awaited<ReturnType<typeof getProducts>>;
export type ProductsResponseSuccess = ProductsRsesponse["data"];
