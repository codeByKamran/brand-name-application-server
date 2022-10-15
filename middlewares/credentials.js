import { allowedOrigins } from "../config/origins.js";

const credentials = async (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    req.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

export default credentials;
