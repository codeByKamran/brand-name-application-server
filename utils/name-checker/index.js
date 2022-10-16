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

  response.status = res.status;
  response.statusText = res.statusText;
  // response.headers = res.headers;
  //   response.data = res.data;

  return response;
};
