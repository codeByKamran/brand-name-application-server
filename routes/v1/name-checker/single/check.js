import express from "express";
import {
  snapchatNameChecker,
  instagramNameChecker,
} from "../../../../controllers/name-checker/singleNameCheckerController.js";

const singleNameCheckRouter = express.Router();

singleNameCheckRouter.post("/snapchat/check/:query", snapchatNameChecker);
singleNameCheckRouter.post("/instagram/check/:query", instagramNameChecker);

export default singleNameCheckRouter;
