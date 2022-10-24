import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { axiosDefault } from "../../axios/index.js";
import { logsClearController } from "../../controllers/name-checker/logsClearControllers.js";
const rootRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

rootRouter.route("/initiate").get((req, res) => {
  const headers = {
    "Sec-Ch-Ua": '" Not A;Brand";v="99", "Chromium";v="90"',
    "Sec-Ch-Ua-Mobile": "?0",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    Accept: "*/*",
    Origin: "https://accounts.snapchat.com",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "same-origin",
    "Sec-Fetch-Dest": "empty",
    Referer: "https://accounts.snapchat.com/",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "close",
  };
  const xsrf_token = "JxVkpuY3VbHfOFagfT0csQ";
  const cookies = { xsrf_token: xsrf_token };
  const data = { requested_username: "elonmusk", xsrf_token: xsrf_token };
  axiosDefault
    .post(
      "https://accounts.snapchat.com:443/accounts/get_username_suggestions",
      data,
      { headers },
      cookies
    )
    .then((res) => {
      console.log(res);
      res.status(200).json({ res });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

rootRouter.route("/requestsLogs").get((req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "logs", "requestsLog.txt"));
});

rootRouter.route("/requestsLogs/clear").get(logsClearController);

rootRouter.route("/errorLogs").get((req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "logs", "errorLogs.txt"));
});

export default rootRouter;
