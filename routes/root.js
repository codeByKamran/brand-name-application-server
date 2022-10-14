import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const rootRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

rootRouter.route("/requestsLogs").get((req, res) => {
  res.sendFile(path.join(__dirname, "..", "logs", "requestsLog.txt"));
});

rootRouter.route("/errorLogs").get((req, res) => {
  res.sendFile(path.join(__dirname, "..", "logs", "errorLogs.txt"));
});

export default rootRouter;
