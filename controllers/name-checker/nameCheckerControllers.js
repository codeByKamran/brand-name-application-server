import { axiosDefault, headers } from "../../axios/index.js";
import { platforms } from "../../lib/static/platforms.js";
import {
  formatResponse,
  getProfileURL,
  getUsernameStatus,
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

    const platformPorfLEURLClaimed = getProfileURL(
      platforms[platform].username_claimed,
      platforms[platform].url,
      platforms[platform].urlProbe
    );

    const platformPorfLEURLUnclaimed = getProfileURL(
      platforms[platform].username_unclaimed,
      platforms[platform].url,
      platforms[platform].urlProbe
    );

    if (isValidUsername(username, platforms[platform].regexCheck)) {
      function checkQueryUsername() {
        return axiosDefault.get(platformProfileURL, {
          headers: platform.headers || headers,
          maxRedirects: 0,
        });
      }

      function checkClaimedUsername() {
        return axiosDefault.get(platformPorfLEURLClaimed, {
          headers: platform.headers || headers,
          maxRedirects: 0,
        });
      }

      function checkUnclaimedUsername() {
        return axiosDefault.get(platformPorfLEURLUnclaimed, {
          headers: platform.headers || headers,
          maxRedirects: 0,
        });
      }

      Promise.allSettled([
        checkQueryUsername(),
        checkClaimedUsername(),
        checkUnclaimedUsername(),
      ])
        .then((results) => {
          let queryUsernameResponse = null;
          let claimedUsernameResponse = null;
          let unclaimedUsernameResponse = null;

          if (results[0].status === "fulfilled") {
            queryUsernameResponse = results[0].value;
          } else {
            queryUsernameResponse = results[0].reason.response;
          }

          if (results[1].status === "fulfilled") {
            claimedUsernameResponse = results[1].value;
          } else {
            claimedUsernameResponse = results[1].reason.response;
          }

          if (results[2].status === "fulfilled") {
            unclaimedUsernameResponse = results[2].value;
          } else {
            unclaimedUsernameResponse = results[2].reason.response;
          }

          console.log("Query Username", formatResponse(queryUsernameResponse));
          console.log(
            "Claimed Username",
            formatResponse(claimedUsernameResponse)
          );
          console.log(
            "Unclaimed Username",
            formatResponse(unclaimedUsernameResponse)
          );

          console.log(
            platform,
            getUsernameStatus(
              platforms[platform],
              formatResponse(queryUsernameResponse)
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(`Invalid Username for ${platform}`);
    }
  }

  res.sendStatus(200);
};
