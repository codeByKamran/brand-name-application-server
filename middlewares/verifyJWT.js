import jwt from "jsonwebtoken";
import config from "../config/env.js";

const verifyJWTAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); // unauthorized
  const token = authHeader.split(" ")[1];

  jwt.verify(token, config.ACCESS_TOKEN_SECRET_KEY, (err, decodedData) => {
    if (err) return res.sendStatus(403); // forbidden

    req.username = decodedData.username;
    req.requesterUserID = decodedData._id;
    req.roles = decodedData.roles;
    next();
  });
};

export default verifyJWTAccessToken;
