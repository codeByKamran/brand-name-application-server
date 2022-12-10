import express from "express";
import { spellCheckerController } from "../../../controllers/spell-checker/spellCheckerControllers.js";

const spellCheckRouter = express.Router();

spellCheckRouter.post("/", spellCheckerController);

export default spellCheckRouter;
