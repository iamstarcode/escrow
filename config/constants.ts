import Constants from "expo-constants";

const API_URL = Constants?.expoConfig?.extra?.API_URL;

const SUPABASE_STORAGE_KEY = "supabase-storage-key";
const SWR_GET_PRODUCTS = "get-products";
const SWR_GET_PRODUCT = "get-product";
export { API_URL, SUPABASE_STORAGE_KEY, SWR_GET_PRODUCTS, SWR_GET_PRODUCT };
