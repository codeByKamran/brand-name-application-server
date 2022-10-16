import { axiosDefault, headers } from "../../axios/index.js";
import { platforms } from "../../lib/static/platforms.js";
import {
  formatResponse,
  getProfileURL,
  isValidUsername,
} from "../../utils/name-checker/index.js";

export const checkNamesController = async (req, res) => {
  const { query: username } = req.params;
  const { body: data } = req;

  console.log(username);

  for (const platform in platforms) {
    const platformProfileURL = getProfileURL(
      username,
      platforms[platform].url,
      platforms[platform].urlProbe
    );
    if (isValidUsername(username, platforms[platform].regexCheck)) {
      axiosDefault
        .get(platformProfileURL, {
          headers: platform.headers || headers,
          maxRedirects: 0,
        })
        .then((res) => {
          // Assumption 1: Looks unavailable
          // TODO: Perform checks based on platform AVAILABILE, UNAVAILABILE, and GLOBAL response
          // TODO: Send response to Client once sure

          console.log(`>>> ${platform} Response:`, formatResponse(res));
        })
        .catch((err) => {
          // Assumption 1: Looks AVAILABILE
          // Reading 1: Top Error Responses are 404, 403, 999(Linkedin), read ECONNRESET (Instagram, Google Play Store)
          // TODO: Perform checks based on platform AVAILABILE, UNAVAILABILE, and GLOBAL response
          // TODO: Send response to Client once sure

          if (err.response?.status) {
            console.log(`${platform} Error`, {
              ...formatResponse(err.response),
              errorMsg: err.message,
            });
          } else {
            console.log(`${platform} Error Message`, err.message);
          }
        });
    } else {
      console.log(`Invalid Username for ${platform}`);
    }
  }

  res.sendStatus(200);
};
