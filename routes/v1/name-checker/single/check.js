import express from "express";
import {
  instagramNameChecker,
  tiktokNameChecker,
  twitterNameChecker,
} from "../../../../controllers/name-checker/singleNameCheckerController.js";

const singleNameCheckRouter = express.Router();

singleNameCheckRouter.post("/instagram/check/:query", instagramNameChecker);
singleNameCheckRouter.post("/tiktok/check/:query", tiktokNameChecker);
singleNameCheckRouter.post("/twitter/check/:query", twitterNameChecker);

export default singleNameCheckRouter;
