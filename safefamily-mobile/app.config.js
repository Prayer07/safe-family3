import 'dotenv/config';

export default {
  expo: {
    name: "safe-family",
    slug: "safe-family",
    scheme: "safefamily",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon2.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    splash: {
      image: "./assets/icon2.png",
      resizeMode: "contain",
      backgroundColor: "#be6464ff"
    },

    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      },
      // googleServicesFile: "./GoogleService-Info.plist" // 👈 Add this
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
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },

    web: {
      favicon: "./assets/favicon.png"
    },

    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          // icon: "./assets/notification-icon.png",
          // color: "#FF3B30",
          // sounds: ["./assets/sos-alert.wav"]
        }
      ]
    ],

    extra: {
      env: "development",
      router: {},
      eas: {
        "projectId": "21d023ef-4aa3-4025-a292-fe0f1aeb6366"
      }
    }
  }
};