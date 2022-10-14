import express from "express";
import { userRoles } from "../config/userRoles.js";
import {
  addSnippet,
  deleteSnippet,
  getManySnippets,
  getSnippetById,
  getSnippets,
  getSnippetsByLabel,
  updateSnippet,
} from "../controllers/snippetsController.js";
import verifyRoles from "../middlewares/verifyRoles.js";
const snippetsRouter = express.Router();

// Routes

snippetsRouter.get("/:id", getSnippetById); // everyone can hit

snippetsRouter.get("/", getSnippets); // everyone can hit

snippetsRouter.post("/many", getManySnippets); // everyone can hit

snippetsRouter.post("/f/label/:labelID", getSnippetsByLabel); // everyone can hit

snippetsRouter.post(
  "/",
  verifyRoles(userRoles.Admin, userRoles.User),
  addSnippet
);

snippetsRouter.put(
  "/:id",
  verifyRoles(userRoles.Admin, userRoles.User),
  updateSnippet
);

snippetsRouter.delete(
  "/:id",
  verifyRoles(userRoles.Admin, userRoles.User),
  deleteSnippet
);

export default snippetsRouter;
