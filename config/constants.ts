import Constants from "expo-constants";

const API_URL = Constants?.expoConfig?.extra?.API_URL;

const SUPABASE_STORAGE_KEY = "supabase-storage-key";
const SWR_GET_PRODUCTS = "get-products";
const SWR_GET_PRODUCT = "get-product";
const SWR_GET_PROFILE_BY_ID = "profile/id/";
const SWR_GET_PROFILE_BY_USERNAME = "profile/username/";

export {
  API_URL,
  SUPABASE_STORAGE_KEY,
  SWR_GET_PRODUCTS,
  SWR_GET_PRODUCT,
  SWR_GET_PROFILE_BY_ID,
  SWR_GET_PROFILE_BY_USERNAME,
};
