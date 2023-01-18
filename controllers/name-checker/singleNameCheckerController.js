import fs from "fs";
import puppeteer from "puppeteer";
import UserAgent from "user-agents";
import { fileURLToPath } from "url";
import path from "path";
import ProxyAgent from "proxy-agent";
import buid from "basic-instagram-user-details";
import { axiosDefault } from "../../axios/index.js";
import { io } from "../../server.js";
import { formatSpecialPlatformStatus } from "../../utils/name-checker/index.js";

export const snapchatNameChecker = async (req, res) => {
  const { query: username } = req.params;
  const { origin } = req.body;
  console.log("Snapchat username", username);

  // const xsrf_token = "JxVkpuY3VbHfOFagfT0csQ";

  // const headers = {
  //   "User-Agent":
  //     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0",
  //   Cookie: `xsrf_token=${xsrf_token}`,
  // };

  // const url = `https://accounts.snapchat.com/accounts/get_username_suggestions?requested_username=${username}&xsrf_token=${xsrf_token}`;

  // axiosDefault
  //   .post(url, {}, { headers: headers })
  //   .then((response) => {
  //     io.emit(
  //       origin === "NAME_GENERATOR_POPUP"
  //         ? "name_generator_platform_status_update"
  //         : "platform_status_update",
  //       {
  //         ...formatSpecialPlatformStatus("snapchat", response.data.value),
  //         username,
  //         origin,
  //       }
  //     );
  //     res
  //       .status(200)
  //       .json(formatSpecialPlatformStatus("snapchat", response.data.value));
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ message: err.message });
  //   });

  io.emit(
    origin === "NAME_GENERATOR_POPUP"
      ? "name_generator_platform_status_update"
      : "platform_status_update",
    {
      message: "Logic Pending",
      available: false,
      username: username,
      origin,
      platform: "snapchat",
    }
  );

  res.status(200).json({
    message: "Logic Pending",
    available: false,
    username: username,
    platform: "snapchat",
  });
};

export const instagramNameChecker = async (req, res) => {
  const { query: username } = req.params;
  const { origin } = req.body;
  console.log("Instagram username", username);

  // buid(username, "id").then(({ data }) => {
  //   let result = {};
  //   if (data === `Cannot read properties of undefined (reading 'split')`) {
  //     result = {
  //       available: true,
  //       platform: "instagram",
  //       checks: 1,
  //     };
  //   } else {
  //     result = {
  //       available: false,
  //       platform: "instagram",
  //       checks: 1,
  //     };
  //   }

  //   io.emit(
  //     origin === "NAME_GENERATOR_POPUP"
  //       ? "name_generator_platform_status_update"
  //       : "platform_status_update",
  //     { ...result, username, origin }
  //   );
  //   res.status(200).json(result);
  // });

  io.emit(
    origin === "NAME_GENERATOR_POPUP"
      ? "name_generator_platform_status_update"
      : "platform_status_update",
    {
      message: "Logic Pending",
      available: false,
      username: username,
      origin,
      platform: "instagram",
    }
  );

  res.status(200).json({
    message: "Logic Pending",
    available: false,
    username: username,
    platform: "instagram",
  });
};

// const selectors = {
//   url: "https://www.instagram.com/" + username,
//   availableContentIndicator: "Sorry, this page isn't available.",
// };

// let browser = null;
// let page = null;

// try {
//   browser = await puppeteer.launch({
//     args: ["--no-sandbox"],
//   });

//   page = await browser.newPage();
// } catch (err) {
//   console.log(err.message);
// }

// try {
//   await page.goto(selectors.url, {
//     waitUntil: ["load", "domcontentloaded"],
//   });

//   const pageContent = await page.content();
//   console.log(pageContent);

//   if (pageContent?.indexOf(selectors.availableContentIndicator) > -1) {
//     // mean present in content
//     console.log("Available");
//   } else {
//     console.log("Not Available");
//   }
// } catch (err) {
//   // some error occured
//   console.log(err.message);
// } finally {
//   await browser.close();
// }

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const proxies = fs
//   .readFileSync(path.join(__dirname, ".", "extra", "proxies.txt"), "utf-8")
//   .replace(/\r/gi, "")
//   .split("\n");

// var userAgent = new UserAgent();

export const tiktokNameChecker = async (req, res) => {
  const { query: username } = req.params;
  const { origin } = req.body;
  console.log("Tiktok username", username);

  // let proxy = proxies[Math.floor(Math.random() * proxies.length)];
  // let agent = new ProxyAgent(`socks4://` + proxy);

  // console.log(agent);

  // io.emit(
  //   origin === "NAME_GENERATOR_POPUP"
  //     ? "name_generator_platform_status_update"
  //     : "platform_status_update",
  //   {
  //     message: "Logic Pending",
  //     available: false,
  //     username,
  //     origin,
  //   }
  // );

  io.emit(
    origin === "NAME_GENERATOR_POPUP"
      ? "name_generator_platform_status_update"
      : "platform_status_update",
    {
      message: "Logic Pending",
      available: false,
      username: username,
      origin,
      platform: "tiktok",
    }
  );

  res.status(200).json({
    message: "Logic Pending",
    available: false,
    username: username,
    platform: "tiktok",
  });
};

export const twitterNameChecker = async (req, res) => {
  const { query: username } = req.params;
  const { origin } = req.body;
  console.log("Twitter username", username);

  // axiosDefault
  //   .get("https://twitter.com/i/search/typeahead.json?q=" + username)
  //   .then((response) => {
  //     const users = response.data.users.map((user) => ({
  //       id: user.id,
  //       name: user.name,
  //       screen_name: user.screen_name,
  //     }));
  //     let usernameCheckResult = null;
  //     let count = 0;
  //     users.forEach((user) => {
  //       if (
  //         String(user.screen_name).toLowerCase() ===
  //         String(username).toLowerCase()
  //       ) {
  //         usernameCheckResult = {
  //           matched: true,
  //           perfectMatch: true,
  //           count: count + 1,
  //         };
  //       } else if (
  //         String(user.screen_name)
  //           .toLowerCase()
  //           .includes(String(username).toLowerCase())
  //       ) {
  //         usernameCheckResult = { matched: true, count: count + 1 };
  //         count++;
  //       }
  //     });
  //     let result = {};
  //     console.log({ usernameCheckResult });
  //     if (!usernameCheckResult) {
  //       result = { available: true, checks: 1, platform: "twitter" };
  //     } else if (
  //       usernameCheckResult?.matched ||
  //       usernameCheckResult?.perfectMatch
  //     ) {
  //       result = { available: false, checks: 1, platform: "twitter" };
  //     }
  //     io.emit(
  //       origin === "NAME_GENERATOR_POPUP"
  //         ? "name_generator_platform_status_update"
  //         : "platform_status_update",
  //       { ...result, username, origin }
  //     );
  //     res.status(200).json(result);
  //   })
  //   .catch((err) => console.log(err.message));

  io.emit(
    origin === "NAME_GENERATOR_POPUP"
      ? "name_generator_platform_status_update"
      : "platform_status_update",
    {
      message: "Logic Pending",
      available: false,
      username: username,
      origin,
      platform: "twitter",
    }
  );

  res.status(200).json({
    message: "Logic Pending",
    available: false,
    username: username,
    platform: "twitter",
  });
};

/*
Instagram Junk

async function checkAvailability(str) {
    const selectors = {
      url: "https://www.instagram.com/" + str,
      availableContentIndicator: "Sorry, this page isn't available.",
    };

    let browser = null;
    let page = null;

    try {
      browser = await puppeteer.launch({
        args: ["--no-sandbox"],
      });

      page = await browser.newPage();
    } catch (err) {
      console.log(err.message);
      return {
        available: false,
        error: true,
        message: err.message,
        platform: "instagram",
        checks: 1,
      };
    }

    try {
      await page.goto(selectors.url, {
        waitUntil: ["load", "domcontentloaded"],
      });

      const pageContent = await page.content();

      if (pageContent?.indexOf(selectors.availableContentIndicator) > -1) {
        // mean present in content
        return {
          available: true,
          platform: "instagram",
          checks: 1,
        };
      } else {
        return {
          available: false,
          platform: "instagram",
          checks: 1,
        };
      }
    } catch (err) {
      // some error occured
      console.log(err.message);
      return {
        available: false,
        error: true,
        message: err.message,
        platform: "instagram",
        checks: 1,
      };
    } finally {
      await browser.close();
    }
  }

  const result = await checkAvailability(username);
  const result = {
    available: true,
    platform: "instagram",
    checks: 1,
  };

  io.emit(origin === "NAME_GENERATOR_POPUP"
                  ? "name_generator_platform_status_update"
                  : "platform_status_update", result);

  res.status(200).json(result);
*/

/*
Tiktok junk

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
*/

{
  /*

  Twitter junk

    // twitterName(username, function (err, isAvailable) {
  //   console.log(isAvailable);
  // });


const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ],
  });
  try {
    const page = await browser.newPage();
    await page.goto("https://instagram.com/enoonewu");

    const content = await page.content();
    console.log(content);
  } catch (err) {
    console.log(err.message);
  }

  await browser.close();

  const headers = {
    accept: "*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,bn;q=0.8",
    authorization:
      "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
    "content-type": "application/json",
    dnt: "1",
    origin: "https://twitter.com",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36",
    "x-twitter-active-user": "yes",
    "x-twitter-client-language": "en",
  };

  const url =
    "https://api.twitter.com/graphql/P8ph10GzBbdMqWZxulqCfA/UserByScreenName?variables=%7B%22screen_name%22%3A%22" +
    twitterUsername +
    "%22%2C%22withHighlightedLabel%22%3Atrue%7D";

  axiosDefault
    .get(url, { headers })
    .then((response) => {
      console.log(response);
      res.status(200).json({ result: response.data });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
  */
}
