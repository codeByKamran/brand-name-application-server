import dotenv from "dotenv";

dotenv.config();

export default {
  MONGO_URI:
    process.env.NODE_ENV === "production"
      ? process.env.ATLAS_URI
      : process.env.LOCAL_MONGO_URL,
  ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
  GODADDY_API_KEY: process.env.GODADDY_API_KEY,
  GODADDY_SECRET: process.env.GODADDY_SECRET,
  PUSHER_ID: process.env.PUSHER_ID,
  PUSHER_KEY: process.env.PUSHER_KEY,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
  LIVE_SERVER_DEPLOYMENT: "https://brand-names-backend.adaptable.app",
};

// https://brand-names-backend.adaptable.app
// http://localhost:3500
