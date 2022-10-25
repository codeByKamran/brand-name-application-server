// import puppeteer from "puppeteer";
import { axiosDefault } from "../../axios/index.js";
import { io } from "../../server.js";
import { formatSpecialPlatformStatus } from "../../utils/name-checker/index.js";

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
  console.log("Instagram username", instagramUsername);

  const selectors = {
    url: "https://www.instagram.com/",
    input: "[name=username]",
    errorIcon: "span.coreSpriteInputError",
  };

  async function checkAvailability(username) {
    // const browser = await puppeteer.launch({
    //   args: ["--no-sandbox"],
    // });
    // const page = await browser.newPage();
    // await page.goto(selectors.url, {
    //   waitUntil: ["load", "domcontentloaded"],
    // });

    // await page.waitForSelector(selectors.input);
    // await page.type(selectors.input, username);
    // await page.click("body");

    // try {
    //   await page.waitForSelector(selectors.errorIcon, {
    //     visible: true,
    //     timeout: 250,
    //   });

    //   return false;
    // } catch (e) {
    //   // page.waitForSelector will throw if element not found
    //   console.log(e);
    //   return true;
    // } finally {
    //   await browser.close();
    // }
    return true;
  }

  res.status(200).json({ available: checkAvailability(instagramUsername) });
};
