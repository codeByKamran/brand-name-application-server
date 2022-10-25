import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { axiosDefault } from "../../axios/index.js";
import { logsClearController } from "../../controllers/name-checker/logsClearControllers.js";
const rootRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

rootRouter.route("/initiate").get((req, res) => {
      res.status(202).json({message: 'Server Awake and Connected'});
});

rootRouter.route("/requestsLogs").get((req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "logs", "requestsLog.txt"));
});

rootRouter.route("/requestsLogs/clear").get(logsClearController);

rootRouter.route("/errorLogs").get((req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "logs", "errorLogs.txt"));
});

export default rootRouter;
