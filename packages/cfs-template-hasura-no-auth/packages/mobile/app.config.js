import "dotenv/config";

export default {
  name: "Todo",
  slug: "mobile",
  platforms: ["ios", "android"],
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
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
  },
  extra: {
    graphqlUrl: process.env.GRAPHQL_URL,
  },
  // TODO: Set this
  // https://docs.expo.io/workflow/linking/#in-a-standalone-app
  scheme: "mobile",
};
