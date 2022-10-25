import { axiosDefault } from "../../axios/index.js";
import {
  formatResponse,
  formatSpecialPlatformStatus,
} from "../../utils/name-checker/index.js";

export const snapchatNameChecker = async (req, res) => {
  const { query: snapchatUsername } = req.params;
  console.log("Snapchat username", snapchatUsername);

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
  const data = { requested_username: snapchatUsername, xsrf_token: xsrf_token };

  axiosDefault
    .post(
      "https://accounts.snapchat.com:443/accounts/get_username_suggestions",
      data,
      { headers },
      cookies
    )
    .then((response) => {
      console.log(response);
      return res.status(200).json({
        result: formatSpecialPlatformStatus(
          "snapchat",
          formatResponse(response)
        ),
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: err.message });
    });
};
