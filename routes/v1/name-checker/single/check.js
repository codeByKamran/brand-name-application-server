import express from "express";
import {
  snapchatNameChecker,
  instagramNameChecker,
  tiktokNameChecker,
  twitterNameChecker,
  facebookNameChecker,
} from "../../../../controllers/name-checker/singleNameCheckerController.js";

const singleNameCheckRouter = express.Router();

singleNameCheckRouter.post("/snapchat/check/:query", snapchatNameChecker);
singleNameCheckRouter.post("/instagram/check/:query", instagramNameChecker);
singleNameCheckRouter.post("/tiktok/check/:query", tiktokNameChecker);
singleNameCheckRouter.post("/twitter/check/:query", twitterNameChecker);
singleNameCheckRouter.post("/facebook/check/:query", facebookNameChecker);

export default singleNameCheckRouter;
