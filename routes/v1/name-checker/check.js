import express from "express";
import { checkNamesController } from "../../../controllers/name-checker/nameCheckerControllers.js";

const nameCheckRouter = express.Router();

nameCheckRouter.post("/check/:query", checkNamesController);

export default nameCheckRouter;
