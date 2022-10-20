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
  const { platforms, domains } = req.body;
  console.log(username);
  console.log(platforms);
  console.log(domains);

  for (const platformKey in platforms) {
    const platform = platforms[platformKey];

    const platformProfileURL = getProfileURL(
      username,
      platform.url,
      platform.urlProbe
    );

    const platformPorfileURLClaimed = getProfileURL(
      platform.username_claimed,
      platform.url,
      platform.urlProbe
    );

    const platformPorfileURLUnclaimed = getProfileURL(
      platform.username_unclaimed,
      platform.url,
      platform.urlProbe
    );

    if (isValidUsername(username, platform.regexCheck)) {
      // check for validatity of username for particuler platformKey
      // no need for further checks
      let currentTime = performance.now();

      const requestHeaders = platform.headers
        ? { ...platform.headers }
        : headers;

      function checkQueryUsername() {
        return axiosDefault.get(platformProfileURL, {
          headers: requestHeaders,
          maxRedirects: platform.errorType === "response_url" && 0,
        });
      }

      function checkClaimedUsername() {
        return axiosDefault.get(platformPorfileURLClaimed, {
          headers: requestHeaders,
          maxRedirects: platform.errorType === "response_url" && 0,
        });
      }

      function checkUnclaimedUsername() {
        return axiosDefault.get(platformPorfileURLUnclaimed, {
          headers: requestHeaders,
          maxRedirects: platform.errorType === "response_url" && 0,
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

          console.log(platformKey + " Query", {
            ...formatResponse(queryUsernameResponse),
            url: platformProfileURL,
            data: null,
          });
          console.log(platformKey + " Claimed", {
            ...formatResponse(claimedUsernameResponse),
            url: platformPorfileURLClaimed,
            data: null,
          });
          console.log(platformKey + " Unclaimed", {
            ...formatResponse(unclaimedUsernameResponse),
            url: platformPorfileURLUnclaimed,
            data: null,
          });

          console.log(
            platformKey + " Result",
            getUsernameStatus(platform, formatResponse(queryUsernameResponse))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(`Invalid Username for ${platformKey}`);
    }
  }

  res.sendStatus(200);
};
