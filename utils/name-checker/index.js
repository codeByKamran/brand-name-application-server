export const isValidUsername = (username, pattern = null) => {
  if (!pattern) {
    return true;
  }

  return new RegExp(pattern).test(username);
};

export const getProfileURL = (username, url, urlProbe) => {
  if (urlProbe) {
    return String(urlProbe).replace("<username>", username);
  }

  return String(url).replace("<username>", username);
};

export const formatResponse = (res) => {
  let response = {};

  response.status = res?.status;
  response.statusText = res?.statusText;
  if (res?.headers?.hasOwnProperty("request-duration")) {
    response.requestDuration = res.headers["request-duration"];
  }
  if (res?.requestDuration) {
    response.requestDuration = res.requestDuration;
  }
  // response.headers = res?.headers;
  response.data = res?.data;

  return response;
};

export const getUsernameStatus = (platform, response) => {
  if (response.status) {
    // check if response valid
    if (platform.errorType === "message") {
      // console.log(response?.data);
      // YouTube
      if (response?.data?.includes(platform.availableContentSearch)) {
        // AVAILABLE - Error message present in returned page content
        if (platform?.availableStatusTexts.includes(response.statusText)) {
          // AVAILABLE - Double Check - Status messages matched
          if (platform?.availableStatusCodes.includes(response.status)) {
            // AVAILABLE - Tripple Check - Status Codes matched
            return {
              available: true,
              checks: 3,
              platform: platform.platformCode,
            };
          } else {
            return {
              available: true,
              checks: 2,
              platform: platform.platformCode,
            };
          }
        } else {
          return {
            available: true,
            checks: 1,
            platform: platform.platformCode,
          };
        }
      } else {
        // TAKEN - Error message not present in returned page content
        if (platform?.takenStatusTexts.includes(response.statusText)) {
          // TAKEN - Double Check - Status messages matched
          if (platform?.takenStatusCodes.includes(response.status)) {
            // TAKEN - Tripple Check - Status codes matched
            return {
              available: false,
              checks: 3,
              platform: platform.platformCode,
            };
          } else {
            return {
              available: false,
              checks: 2,
              platform: platform.platformCode,
            };
          }
        } else {
          return {
            available: false,
            checks: 1,
            platform: platform.platformCode,
          };
        }
      }
    }

    if (platform.errorType === "message_taken") {
      // console.log(response?.data);
      if (response?.data?.includes(platform.takenContentSearch)) {
        //  TAKEN
        return { available: false, checks: 1, platform: platform.platformCode };
      } else {
        // AVAILABLE
        return { available: true, checks: 1, platform: platform.platformCode };
      }
    }

    if (platform.errorType === "status_code") {
      // facebook

      if (platform?.availableStatusCodes.includes(response.status)) {
        // AVAILABLE
        if (platform?.availableStatusTexts.includes(response.statusText)) {
          // double-check - AVAILABLE
          return {
            available: true,
            checks: 2,
            platform: platform.platformCode,
          };
        } else {
          return {
            available: true,
            checks: 1,
            platform: platform.platformCode,
          };
        }
      } else {
        // TAKEN
        if (platform?.takenStatusCodes.includes(response.status)) {
          // double-check - TAKEN
          if (platform?.takenStatusTexts.includes(response.statusText)) {
            // tripple-check - TAKEN
            return {
              available: false,
              checks: 3,
              platform: platform.platformCode,
            };
          } else {
            return {
              available: false,
              checks: 2,
              platform: platform.platformCode,
            };
          }
        } else {
          return {
            available: false,
            checks: 1,
            platform: platform.platformCode,
          };
        }
      }
    }

    if (platform.errorType === "response") {
      if (response.data.length < 1) {
        // AVAILABLE
        return { available: true, checks: 1, platform: platform.platformCode };
      } else {
        // TAKEN
        return { available: false, checks: 1, platform: platform.platformCode };
      }
    }

    if (platform.errorType === "response_url") {
      if (response.status >= 200 && response.status < 300) {
        // TAKEN
        return { available: false, checks: 1, platform: platform.platformCode };
      } else {
        // AVAILABLE
        return { available: true, checks: 1, platform: platform.platformCode };
      }
    }
  } else {
    // No Status Found in Response - Failed Response
    if (response.invalid) {
      // Username is invalid
      return { failed: true, invalid: true, platform: platform.platformCode };
    }

    return { available: false, failed: true, platform: platform.platformCode };
  }
};

export const formatSpecialPlatformStatus = (platform, response) => {
  if (platform === "snapchat") {
    if (
      response.status_code === "TAKEN" ||
      response.status_code === "DELETED"
    ) {
      // TAKEN
      return { available: false, checks: 1, platform: platform };
    } else if (response.status_code === "OK") {
      // AVAILABLE
      return { available: true, checks: 1, platform: platform };
    } else if (response.status_code === "TOO_LONG") {
      return {
        available: false,
        failed: true,
        invalid: true,
        reason: "Username too long",
        statusCode: "TOO_LONG",
        platform: platform,
      };
    } else if (response.status_code === "TOO_SHORT") {
      return {
        available: false,
        failed: true,
        invalid: true,
        reason: "Username too short",
        statusCode: "TOO_SHORT",
        platform: platform,
      };
    } else {
      return {
        available: false,
        failed: true,
        reason: response.error_message,
        statusCode: response.status_code,
        platform: platform,
      };
    }
  }
};
