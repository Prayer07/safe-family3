import 'dotenv/config';

export default {
  expo: {
    name: "SafeFamily",
    slug: "safe-family",
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    ios: {
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    }
  }
};