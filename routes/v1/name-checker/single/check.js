import express from "express";
import {
  snapchatNameChecker,
  instagramNameChecker,
  tiktokNameChecker,
} from "../../../../controllers/name-checker/singleNameCheckerController.js";

const singleNameCheckRouter = express.Router();

singleNameCheckRouter.post("/snapchat/check/:query", snapchatNameChecker);
singleNameCheckRouter.post("/instagram/check/:query", instagramNameChecker);
singleNameCheckRouter.post("/tiktok/check/:query", tiktokNameChecker);

export default singleNameCheckRouter;
