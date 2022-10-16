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
  // response.headers = res?.headers;
  //   response.data = res?.data;

  return response;
};

export const getUsernameStatus = (platform, response = []) => {
  if (platform.errorType === "message") {
    // youtube

    if (platform?.availableMsgs.includes(response.statusText)) {
      // AVAILABLE
      if (platform?.availableStatusCodes.includes(response.status)) {
        // double-check - AVAILABLE
        return { available: true, checks: 2, platform: platform.platform };
      } else {
        return { available: true, checks: 1, platform: platform.platform };
      }
    } else {
      // TAKEN
      if (platform?.takenMsgs.includes(response.statusText)) {
        // double-check - TAKEN
        if (platform?.takenStatusCodes.includes(response.status)) {
          // triple-check - TAKEN
          return { available: false, checks: 3, platform: platform.platform };
        } else {
          return { available: false, checks: 2, platform: platform.platform };
        }
      } else {
        return { available: false, checks: 1, platform: platform.platform };
      }
    }
  }

  if (platform.errorType === "status_code") {
    // facebook

    if (platform?.availableStatusCodes.includes(response.status)) {
      // AVAILABLE
      if (platform?.availableMsgs.includes(response.statusText)) {
        // double-check - AVAILABLE
        return { available: true, checks: 2 };
      } else {
        return { available: true, checks: 1 };
      }
    } else {
      // TAKEN
      if (platform?.takenStatusCodes.includes(response.status)) {
        // double-check - TAKEN
        if (platform?.takenMsgs.includes(response.statusText)) {
          // tripple-check - TAKEN
          return { available: false, checks: 3 };
        } else {
          return { available: false, checks: 2 };
        }
      } else {
        return { available: false, checks: 1 };
      }
    }
  }
};
