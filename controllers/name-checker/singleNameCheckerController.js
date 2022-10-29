import { axiosDefault } from "../../axios/index.js";
import { io } from "../../server.js";
import { formatSpecialPlatformStatus } from "../../utils/name-checker/index.js";
import ProxyAgent from "proxy-agent";
import UserAgent from "user-agents";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

export const snapchatNameChecker = async (req, res) => {
  const { query: username } = req.params;
  console.log("Snapchat username", username);

  const xsrf_token = "JxVkpuY3VbHfOFagfT0csQ";

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0",
    Cookie: `xsrf_token=${xsrf_token}`,
  };

  const url = `https://accounts.snapchat.com/accounts/get_username_suggestions?requested_username=${username}&xsrf_token=${xsrf_token}`;

  axiosDefault
    .post(url, {}, { headers: headers })
    .then((response) => {
      io.emit(
        "platform_status_update",
        formatSpecialPlatformStatus("snapchat", response.data.value)
      );
      res
        .status(200)
        .json(formatSpecialPlatformStatus("snapchat", response.data.value));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
};

export const instagramNameChecker = async (req, res) => {
  const { query: username } = req.params;
  console.log("Instagram username", username);

  const selectors = {
    url: "https://www.instagram.com/" + username,
    availableContentIndicator: "Sorry, this page isn't available.",
  };

  async function checkAvailability(str) {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(selectors.url, {
      waitUntil: ["load", "domcontentloaded"],
    });

    try {
      const pageContent = await page.content();
      if (pageContent.indexOf(selectors.availableContentIndicator) > -1) {
        // mean present in content
        return {
          availble: true,
          platform: "instagram",
          checks: 1,
        };
      }

      return {
        available: false,
        platform: "instagram",
        checks: 1,
      };
    } catch (e) {
      console.log(e.message);
      return {
        available: false,
        error: true,
        message: e.message,
        platform: "instagram",
        checks: 1,
      };
    } finally {
      await browser.close();
    }
  }

  const result = await checkAvailability(username);

  io.emit("platform_status_update", result);

  res.status(200).json(result);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proxies = fs
  .readFileSync(path.join(__dirname, ".", "extra", "proxies.txt"), "utf-8")
  .replace(/\r/gi, "")
  .split("\n");

var userAgent = new UserAgent();

export const tiktokNameChecker = async (req, res) => {
  const { query: username } = req.params;
  console.log("Tiktok username", username);

  let proxy = proxies[Math.floor(Math.random() * proxies.length)];
  let agent = new ProxyAgent(`socks4://` + proxy);

  console.log(proxy, agent);

  // axiosDefault
  //   .head(`https://www.tiktok.com/@${username}`, {
  //     headers: {
  //       "User-Agent": userAgent.toString(),
  //       // "accept-encoding": "gzip, deflate, br",
  //       "accept-language": "en-US",
  //       "content-type": "application/json",
  //     },
  //     httpsAgent: agent,
  //   })
  //   .then((ress) => {
  //     console.log("1", ress);
  //   })
  //   .catch((err) => console.log("1", err.message));

  // axiosDefault
  //   .head(`https://www.tiktok.com/@${username}`, {
  //     headers: {
  //       "User-Agent": userAgent.toString(),
  //       // "accept-encoding": "gzip, deflate, br",
  //       "accept-language": "en-US",
  //       "content-type": "application/json",
  //     },
  //     httpAgent: agent,
  //   })
  //   .then((ress) => {
  //     console.log("2", ress);
  //   })
  //   .catch((err) => console.log("2", err.message));

  // axiosDefault
  //   .get(`https://www.tiktok.com/@${username}`, {
  //     headers: {
  //       "User-Agent": userAgent.toString(),
  //       "accept-encoding": "gzip, deflate, br",
  //       "accept-language": "en-US",
  //       "content-type": "application/json",
  //     },
  //     httpAgent: agent,
  //   })
  //   .then((ress) => {
  //     console.log("3", ress);
  //   })
  //   .catch((err) => console.log("3", err.message));

  // request(
  //   {
  //     method: "HEAD",
  //     url: `https://www.tiktok.com/@${username}`,
  //     agent,
  //     headers: {
  //       "User-Agent": userAgent.toString(),
  //       "accept-encoding": "gzip, deflate, br",
  //       "accept-language": "en-US",
  //       "content-type": "application/json",
  //     },
  //   },
  //   (errrr, resss, body) => {
  //     if (errrr) {
  //       console.log("Request error", errrr);
  //     }
  //     console.log("Request resss", resss);
  //     console.log("Request body", body);
  //   }
  // );

  res.status(200).json({
    message: "Logic Pending",
    available: false,
    username: username,
  });
};

export const twitterNameChecker = async (req, res) => {
  const { query: username } = req.params;
  console.log("Twitter username", twitterUsername);
  // const browser = await puppeteer.launch({
  //   args: [
  //     "--no-sandbox",
  //     "--disable-setuid-sandbox",
  //     '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
  //   ],
  // });
  // try {
  //   const page = await browser.newPage();
  //   await page.goto("https://instagram.com/enoonewu");

  //   const content = await page.content();
  //   console.log(content);
  // } catch (err) {
  //   console.log(err.message);
  // }

  // await browser.close();

  // const headers = {
  //   accept: "*/*",
  //   "accept-encoding": "gzip, deflate, br",
  //   "accept-language": "en-US,en;q=0.9,bn;q=0.8",
  //   authorization:
  //     "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
  //   "content-type": "application/json",
  //   dnt: "1",
  //   origin: "https://twitter.com",
  //   "sec-fetch-dest": "empty",
  //   "sec-fetch-mode": "cors",
  //   "sec-fetch-site": "same-site",
  //   "user-agent":
  //     "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36",
  //   "x-twitter-active-user": "yes",
  //   "x-twitter-client-language": "en",
  // };

  // const url =
  //   "https://api.twitter.com/graphql/P8ph10GzBbdMqWZxulqCfA/UserByScreenName?variables=%7B%22screen_name%22%3A%22" +
  //   twitterUsername +
  //   "%22%2C%22withHighlightedLabel%22%3Atrue%7D";

  // axiosDefault
  //   .get(url, { headers })
  //   .then((response) => {
  //     console.log(response);
  //     res.status(200).json({ result: response.data });
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //     res.status(500).json({ message: err.message });
  //   });

  res.status(200).json({
    message: "Logic Pending",
    available: false,
    username,
  });
};
