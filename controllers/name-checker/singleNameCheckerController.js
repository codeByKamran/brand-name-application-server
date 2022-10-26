import { axiosDefault } from "../../axios/index.js";
import { io } from "../../server.js";
import { formatSpecialPlatformStatus } from "../../utils/name-checker/index.js";
import tiktok from "tiktok-app-api";

let tiktokApp;

(async () => {
  tiktokApp = await tiktok();
})();

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

export const tiktokNameChecker = async (req, res) => {
  const { query: tiktokUsername } = req.params;
  console.log("Tiktok username", tiktokUsername);

  const user = await tiktokApp.getUserByName(tiktokUsername);
  console.log({ user });

  // const headers = {'Connection': 'keep-alive', 'User-Agent': 'TikTok 17.4.0 rv:174014 (iPhone; iOS 13.6.1; sv_SE) Cronet'}

  res.status(200).json({ user });
};
