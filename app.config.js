module.exports = {
  expo: {
    scheme: "escrow",
    name: "Escrow",
    slug: "escrow",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.abcd1234.escrow",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.iamstarcode.escrow",
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    extra: {
      eas: {
        projectId: "40045458-2c13-49bc-9745-2576e383af6a",
      },
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
