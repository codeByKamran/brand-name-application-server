import { performance } from "perf_hooks";
import { axiosDefault, headers } from "../../axios/index.js";
import { platforms as platformsAll } from "../../lib/static/platforms.js";
import { io } from "../../server.js";
import {
  formatResponse,
  getProfileURL,
  getUsernameStatus,
  isValidUsername,
} from "../../utils/name-checker/index.js";

export const checkNamesController = async (req, res) => {
  const { query: username } = req.params;
  const { platforms: platformsToSearch, origin } = req.body;
  console.log("Username to check", username);
  console.log("Platforms to check", platformsToSearch);

  // filter platforms to search
  const filteredPlatformsToSearch = req.body.all
    ? platformsAll
    : platformsAll.filter((platform) =>
        platformsToSearch.includes(platform.platformCode)
      );

  if (filteredPlatformsToSearch.length === 0) {
    // no platforms specified to search
    res.status(400).json({ message: "No Target Platforms" });
  } else {
    // platforms to search specified - starting search

    for (const platform of filteredPlatformsToSearch) {
      // iterating through list of platforms
      // check for validatity of username for platform
      if (isValidUsername(username, platform.regexCheck)) {
        // username check passed - proceed further with availability check
        // handling special platforms

        if (platform?.special) {
          axiosDefault
            .post(platform.redirect + username, { origin })
            .then((res) => {
              if (res.status === 200) {
                console.log(res.data);
              }
            })
            .catch((err) =>
              console.log(
                platform.platform + " name check error: ",
                err.message
              )
            );
        } else {
          // handling remaining platforms
          // query profile url
          const platformProfileURL = getProfileURL(
            username,
            platform.url,
            platform.urlProbe
          );

          // query profile url
          const platformPorfileURLClaimed = getProfileURL(
            platform.username_claimed,
            platform.url,
            platform.urlProbe
          );

          // query profile url
          const platformPorfileURLUnclaimed = getProfileURL(
            platform.username_unclaimed,
            platform.url,
            platform.urlProbe
          );

          // saving current time to calculate request time (aka... response time - latency)
          let currentTime = performance.now();

          // setting request headers
          const requestHeaders = { ...headers, ...platform?.headers };

          // query username request
          function checkQueryUsername() {
            return axiosDefault.get(platformProfileURL, {
              headers: requestHeaders,
              maxRedirects: platform.errorType === "response_url" && 0,
            });
          }

          // claimed username request
          function checkClaimedUsername() {
            return axiosDefault.get(platformPorfileURLClaimed, {
              headers: requestHeaders,
              maxRedirects: platform.errorType === "response_url" && 0,
            });
          }

          // unclaimed username request
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
              const requestDuration = +(
                performance.now() - currentTime
              ).toFixed(0);
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

              console.log(platform.platform + " Query", {
                ...formatResponse(queryUsernameResponse),
                url: platformProfileURL,
                data: null,
              });

              console.log(platform.platform + " Claimed", {
                ...formatResponse(claimedUsernameResponse),
                url: platformPorfileURLClaimed,
                data: null,
              });

              console.log(platform.platform + " Unclaimed", {
                ...formatResponse(unclaimedUsernameResponse),
                url: platformPorfileURLUnclaimed,
                data: null,
              });

              console.log(platform.platform + " Result", {
                ...getUsernameStatus(
                  platform,
                  formatResponse(queryUsernameResponse)
                ),
                username,
                origin,
              });

              io.emit(
                origin === "NAME_GENERATOR_POPUP"
                  ? "name_generator_platform_status_update"
                  : "platform_status_update",
                {
                  ...getUsernameStatus(
                    platform,
                    formatResponse(queryUsernameResponse)
                  ),
                  username,
                  origin,
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        // Invalid username for this platform
        console.log(`Invalid Username for ${platform.platform}`);
        io.emit(
          origin === "NAME_GENERATOR_POPUP"
            ? "name_generator_platform_status_update"
            : "platform_status_update",
          {
            ...getUsernameStatus(platform, { invalid: true }),
            username,
            origin,
          }
        );
      }
    }
  }
  res.sendStatus(200);
};
