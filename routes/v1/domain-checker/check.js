import express from "express";
import {
  checkDomainsController,
  filterByDomainAvailabilityController,
} from "../../../controllers/domain-checker/domainCheckerControllers.js";

const domainCheckRouter = express.Router();

domainCheckRouter.post("/check/:query", checkDomainsController);
domainCheckRouter.post("/names", filterByDomainAvailabilityController);

export default domainCheckRouter;
