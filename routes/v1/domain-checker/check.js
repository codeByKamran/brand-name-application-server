import express from "express";
import { checkDomainsController } from "../../../controllers/domain-checker/domainCheckerControllers.js";

const domainCheckRouter = express.Router();

domainCheckRouter.post("/check/:query", checkDomainsController);

export default domainCheckRouter;
