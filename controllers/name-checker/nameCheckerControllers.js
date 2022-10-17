import { profile } from "console";
import { performance } from "perf_hooks";
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

  for (const platform in platforms) {
    const platformProfileURL = getProfileURL(
      username,
      platforms[platform].url,
      platforms[platform].urlProbe
    );

    const platformPorfileURLClaimed = getProfileURL(
      platforms[platform].username_claimed,
      platforms[platform].url,
      platforms[platform].urlProbe
    );

    const platformPorfileURLUnclaimed = getProfileURL(
      platforms[platform].username_unclaimed,
      platforms[platform].url,
      platforms[platform].urlProbe
    );

    if (isValidUsername(username, platforms[platform].regexCheck)) {
      // check for validatity of username for particuler platform
      // no need for further checks
      let currentTime = performance.now();
      function checkQueryUsername() {
        return axiosDefault.get(platformProfileURL, {
          headers: platform.headers || headers,
          maxRedirects: 0,
        });
      }

      function checkClaimedUsername() {
        return axiosDefault.get(platformPorfileURLClaimed, {
          headers: platform.headers || headers,
          maxRedirects: 0,
        });
      }

      function checkUnclaimedUsername() {
        return axiosDefault.get(platformPorfileURLUnclaimed, {
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
          const requestDuration = +(performance.now() - currentTime).toFixed(0);
          let queryUsernameResponse = null;
          let claimedUsernameResponse = null;
          let unclaimedUsernameResponse = null;

          if (results[0].status === "fulfilled") {
            queryUsernameResponse = results[0].value;
          } else {
            queryUsernameResponse = {
              ...results[0].reason.response,
              requestDuration,
            };
          }

          if (results[1].status === "fulfilled") {
            claimedUsernameResponse = results[1].value;
          } else {
            claimedUsernameResponse = {
              ...results[1].reason.response,
              requestDuration,
            };
          }

          if (results[2].status === "fulfilled") {
            unclaimedUsernameResponse = results[2].value;
          } else {
            unclaimedUsernameResponse = {
              ...results[2].reason.response,
              requestDuration,
            };
          }

          console.log(platform + " Query", {
            ...formatResponse(queryUsernameResponse),
            url: platformProfileURL,
            data: null,
          });
          console.log(platform + " Claimed", {
            ...formatResponse(claimedUsernameResponse),
            url: platformPorfileURLClaimed,
            data: null,
          });
          console.log(platform + " Unclaimed", {
            ...formatResponse(unclaimedUsernameResponse),
            url: platformPorfileURLUnclaimed,
            data: null,
          });

          console.log(
            platform + " Result",
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
