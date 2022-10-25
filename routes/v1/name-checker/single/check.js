import express from "express";
import { snapchatNameChecker } from "../../../../controllers/name-checker/singleNameCheckerController.js";

const singleNameCheckRouter = express.Router();

singleNameCheckRouter.post("/snapchat/check/:query", snapchatNameChecker);

export default singleNameCheckRouter;
