import { allowedOrigins } from "./origins.js";

export const socketIOOptions = {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
};
