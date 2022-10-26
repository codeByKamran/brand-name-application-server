import { axiosDefault } from "../../axios/index.js";
import { io } from "../../server.js";
import {
  formatSpecialPlatformStatus,
  getProfileURL,
} from "../../utils/name-checker/index.js";
import ProxyAgent from "proxy-agent";
import UserAgent from "user-agents";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import request from "request";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proxies = fs
  .readFileSync(path.join(__dirname, ".", "extra", "proxies.txt"), "utf-8")
  .replace(/\r/gi, "")
  .split("\n");

var userAgent = new UserAgent();

export const tiktokNameChecker = async (req, res) => {
  const { query: tiktokUsername } = req.params;
  console.log("Tiktok username", tiktokUsername);

  let proxy = proxies[Math.floor(Math.random() * proxies.length)];
  let agent = new ProxyAgent(`socks4://` + proxy);

  console.log(proxy, agent);

  axiosDefault
    .head(getProfileURL(tiktokUsername, "https://www.tiktok.com/@<username>"), {
      headers: {
        Connection: "keep-alive",
        "User-Agent":
          "TikTok 17.4.0 rv:174014 (iPhone; iOS 13.6.1; sv_SE) Cronet",
      },
    })
    .then((ress) => {
      console.log(ress);
    })
    .catch((err) => console.log("Hy", err));

  request(
    {
      method: "HEAD",
      url: `https://www.tiktok.com/@${tiktokUsername}`,
      agent,
      headers: {
        "User-Agent": userAgent.toString(),
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US",
        "content-type": "application/json",
      },
    },
    (errrr, resss, body) => {
      if (errrr) {
        console.log("Request error", errrr);
      }
      console.log("Request resss", resss);
      console.log("Request body", body);
    }
  );

  res.sendStatus(200);
};

export const snapchatNameChecker = async (req, res) => {
  const { query: snapchatUsername } = req.params;
  console.log("Snapchat username", snapchatUsername);

  const xsrf_token = "JxVkpuY3VbHfOFagfT0csQ";

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0",
    Cookie: `xsrf_token=${xsrf_token}`,
  };

  const url = `https://accounts.snapchat.com/accounts/get_username_suggestions?requested_username=${snapchatUsername}&xsrf_token=${xsrf_token}`;

  axiosDefault
    .post(url, {}, { headers: headers })
    .then((response) => {
      io.emit(
        "platform_status_update",
        formatSpecialPlatformStatus("snapchat", response.data.value)
      );
      res.status(200).json({
        result: formatSpecialPlatformStatus("snapchat", response.data.value),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
};

export const instagramNameChecker = async (req, res) => {
  const { query: instagramUsername } = req.params;
  console.log("Snapchat username", snapchatUsername);

  res.sendStatus(200);
};
