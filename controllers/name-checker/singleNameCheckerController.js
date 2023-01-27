import fs from "fs";
import request from "request";
import puppeteer from "puppeteer";
import UserAgent from "user-agents";
import { fileURLToPath } from "url";
import path from "path";
import ProxyAgent from "proxy-agent";
import buid from "basic-instagram-user-details";
import { axiosDefault } from "../../axios/index.js";
import { io } from "../../server.js";
import { formatSpecialPlatformStatus } from "../../utils/name-checker/index.js";

export const instagramNameChecker = async (req, res) => {
  const { query: username } = req.params;
  const { origin } = req.body;
  console.log("Instagram username", username);

  buid(username, "id").then(({ data }) => {
    let result = {};
    if (data === `Cannot read properties of undefined (reading 'split')`) {
      result = {
        available: true,
        platform: "instagram",
        checks: 1,
      };
    } else {
      result = {
        available: false,
        platform: "instagram",
        checks: 1,
      };
    }

    io.emit(
      origin === "NAME_GENERATOR_POPUP"
        ? "name_generator_platform_status_update"
        : "platform_status_update",
      { ...result, username, origin }
    );
    res.status(200).json(result);
  });
};

export const twitterNameChecker = async (req, res) => {
  const { query: username } = req.params;
  const { origin } = req.body;
  console.log("Twitter username", username);

  const selectors = {
    url: "https://twitter.com/" + username,
    responseCheckText: "/ Twitter</title>",
    availableCheckText: "<title>Profile / Twitter</title>",
    takenCheckText: `"contentUrl"`,
  };

  let browser = null;
  let page = null;

  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    page = await browser.newPage();
  } catch (err) {
    console.log("Twitter username check error", err.message);
    res.status(500).json({ message: err.message });
  }

  try {
    await page.goto(selectors.url, {
      waitUntil: ["load", "domcontentloaded"],
    });

    const pageContent = await page.content();
    let result = {};
    // check for valid response
    if (pageContent && pageContent?.includes(selectors.responseCheckText)) {
      // valid response
      if (pageContent?.includes(selectors.availableCheckText)) {
        // username available
        result = { available: true, checks: 1 };
      } else {
        // username unavailable
        result = { available: false, checks: 1 };
        // double check
        if (pageContent?.includes(selectors.takenCheckText)) {
          // username unavailable - double checked
          result = { available: false, checks: 2 };
        }
      }
    } else {
      // invalid response
      // recheck again or abort check
      result = {
        available: false,
        failed: true,
        reason: "Request Returned Invalid Response",
      };
    }

    res.status(200).json({ ...result, username, origin, platform: "twitter" });

    io.emit(
      origin === "NAME_GENERATOR_POPUP"
        ? "name_generator_platform_status_update"
        : "platform_status_update",
      { ...result, username, origin, platform: "twitter" }
    );
  } catch (err) {
    // some error occured loading page
    console.log("Twitter username check error", err.message);
    res.status(500).json({ message: err.message });
  } finally {
    await browser.close();
  }
};

export const tiktokNameChecker = async (req, res) => {
  const { query: username } = req.params;
  const { origin } = req.body;
  console.log("Tiktok username", username);

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

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const proxies = fs
//   .readFileSync(path.join(__dirname, ".", "extra", "proxies.txt"), "utf-8")
//   .replace(/\r/gi, "")
//   .split("\n");

// var userAgent = new UserAgent();

// let proxy = proxies[Math.floor(Math.random() * proxies.length)];
// let agent = new ProxyAgent(`socks4://` + proxy);

// io.emit(
//   origin === "NAME_GENERATOR_POPUP"
//     ? "name_generator_platform_status_update"
//     : "platform_status_update",
//   {
//     message: "Logic Pending",
//     available: false,
//     username: username,
//     origin,
//     platform: "instagram",
//   }
// );

// res.status(200).json({
//   message: "Logic Pending",
//   available: false,
//   username: username,
//   platform: "instagram",
// });

// export const snapchatNameChecker = async (req, res) => {
//   // https://feelinsonice-hrd.appspot.com/web/deeplink/snapcode?username=blue&type=SVG
//   const { query: username } = req.params;
//   const { origin } = req.body;
//   console.log("Snapchat username", username);

// const xsrf_token = "JxVkpuY3VbHfOFagfT0csQ";

// const headers = {
//   "User-Agent":
//     "Mozilla/5.0 (X11; CrOS i686 2268.111.0) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11",
//   Accept: "*/*",
//   "Accept-Language": "en-US,en;q=0.5",
//   Referer: "https://accounts.snapchat.com/",
//   Cookie:
//     "xsrf_token=a-JxVkpuY3VbHfOFagfT0csQ; web_client_id=12966659-1ddb-4d0b-8c4c-e39610ddf0f8; _sca={%22cid%22:%2235552e94-28cd-46fc-bf26-b220994ae1d7%22%2C%22token%22:%22v1.key.2018-05-23_8lt9BOpW.iv.ykqLG02DA/OtGORO.j0/QFbsqE82bUtb8Qa0jO6//zEXiS4ZQT4tYissWzZ42fsdCsi8fl7Hy2bEHDm3hs1Li8jciZDbraK3xOUQoTk21tiPgsPcMQvecgafXovbGZOKh%22}; _scid=f2fd66fb-9e11-44d8-a36f-75d807b8d061; sc_at=v2|H4sIAAAAAAAAADNITjFJNjcz100zNjTVNTE2M9RNtDAz1k1NtjAzMU01TElKSqoxNDKwMjQ1NQZKA0VrkJgGAGh4Yl9AAAAA; _sctr=1|1553400000000; oauth_client_id=scan",
//   Connection: "close",
//   "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
// };

// const url = `https://accounts.snapchat.com/accounts/get_username_suggestions?requested_username=${username}&xsrf_token=${xsrf_token}`;

// axiosDefault
//   .post(
//     "https://accounts.snapchat.com/accounts/get_username_suggestions",
//     "requested_username=elonmusk&xsrf_token=a-JxVkpuY3VbHfOFagfT0csQ",
//     { headers: headers }
//   )
//   .then((response) => {
//     console.log("Response =>>>>", response);
//     res.sendStatus(200);
//     // io.emit(
//     //   origin === "NAME_GENERATOR_POPUP"
//     //     ? "name_generator_platform_status_update"
//     //     : "platform_status_update",
//     //   {
//     //     ...formatSpecialPlatformStatus("snapchat", response.data.value),
//     //     username,
//     //     origin,
//     //   }
//     // );
//     // res
//     //   .status(200)
//     //   .json(formatSpecialPlatformStatus("snapchat", response.data.value));
//   })
//   .catch((err) => {
//     console.log(err);
//     res.status(500).json({ message: err.message });
//   });

// io.emit(
//   origin === "NAME_GENERATOR_POPUP"
//     ? "name_generator_platform_status_update"
//     : "platform_status_update",
//   {
//     message: "Logic Pending",
//     available: false,
//     username: username,
//     origin,
//     platform: "snapchat",
//   }
// );

// res.status(200).json({
//   message: "Logic Pending",
//   available: false,
//   username: username,
//   platform: "snapchat",
// });
// };

//  Twitter Username Checker Working
/*
export const twitterNameChecker = async (req, res) => {
  const { query: username } = req.params;
  const { origin } = req.body;
  console.log("Twitter username", username);

  const selectors = {
    url: "https://twitter.com/" + username,
    responseCheckText: "/ Twitter</title>",
    availableCheckText: "<title>Profile / Twitter</title>",
    takenCheckText: `"contentUrl"`,
  };

  let browser = null;
  let page = null;

  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    page = await browser.newPage();
  } catch (err) {
    console.log("Twitter username check error", err.message);
    res.status(500).json({ message: err.message });
  }

  try {
    await page.goto(selectors.url, {
      waitUntil: ["load", "domcontentloaded"],
    });

    const pageContent = await page.content();
    let result = {};
    // check for valid response
    if (pageContent && pageContent?.includes(selectors.responseCheckText)) {
      // valid response
      if (pageContent?.includes(selectors.availableCheckText)) {
        // username available
        result = { available: true, checks: 1 };
      } else {
        // username unavailable
        result = { available: false, checks: 1 };
        // double check
        if (pageContent?.includes(selectors.takenCheckText)) {
          // username unavailable - double checked
          result = { available: false, checks: 2 };
        }
      }
    } else {
      // invalid response
      // recheck again or abort check
      result = {
        available: false,
        failed: true,
        reason: "Request Returned Invalid Response",
      };
    }

    res.status(200).json({ ...result, username, origin, platform: "twitter" });

    io.emit(
      origin === "NAME_GENERATOR_POPUP"
        ? "name_generator_platform_status_update"
        : "platform_status_update",
      { ...result, username, origin, platform: "twitter" }
    );
  } catch (err) {
    // some error occured loading page
    console.log("Twitter username check error", err.message);
    res.status(500).json({ message: err.message });
  } finally {
    await browser.close();
  }
};

*/

// Twitter Username Checker 2 (Working)

/*
export const twitterNameChecker = async (req, res) => {
  const { query: username } = req.params;
  const { origin } = req.body;
  console.log("Twitter username", username);

  axiosDefault
    .get("https://twitter.com/i/search/typeahead.json?q=" + username)
    .then((response) => {
      const users = response.data.users.map((user) => ({
        id: user.id,
        name: user.name,
        screen_name: user.screen_name,
      }));
      let usernameCheckResult = null;
      let count = 0;
      users.forEach((user) => {
        if (
          String(user.screen_name).toLowerCase() ===
          String(username).toLowerCase()
        ) {
          usernameCheckResult = {
            matched: true,
            perfectMatch: true,
            count: count + 1,
          };
        } else if (
          String(user.screen_name)
            .toLowerCase()
            .includes(String(username).toLowerCase())
        ) {
          usernameCheckResult = { matched: true, count: count + 1 };
          count++;
        }
      });
      let result = {};
      console.log("usernameCheckResul", usernameCheckResult);
      if (!usernameCheckResult) {
        result = { available: true, checks: 1, platform: "twitter" };
      } else if (
        usernameCheckResult?.matched ||
        usernameCheckResult?.perfectMatch
      ) {
        result = { available: false, checks: 1, platform: "twitter" };
      }
      io.emit(
        origin === "NAME_GENERATOR_POPUP"
          ? "name_generator_platform_status_update"
          : "platform_status_update",
        { ...result, username, origin }
      );
      res.status(200).json(result);
    })
    .catch((err) => console.log(err.message));

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
*/
