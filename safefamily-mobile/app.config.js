import 'dotenv/config';

export default {
  expo: {
    name: "safe-family",
    slug: "safe-family",
    scheme: "safefamily",
    version: "1.0.0",
    extra: {
      env: "production",
      router: {},
      eas: {
        projectId: "21d023ef-4aa3-4025-a292-fe0f1aeb6366"
      }
    },
    orientation: "portrait",
    icon: "./assets/icon2.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/icon2.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon2.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.prayer072.safefamily",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router"
    ]
  }
};