import { allowedOrigins } from "../config/cors.js";

const credentials = async (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    req.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

export default credentials;
