import axios from "axios";

const axiosDefaultInstance = axios.create();

// Response time request intercepter
axiosDefaultInstance.interceptors.request.use((config) => {
  config.headers["request-startTime"] = process.hrtime();
  return config;
});

// Response time response intercepter
axiosDefaultInstance.interceptors.response.use((response) => {
  const start = response.config.headers["request-startTime"];
  const end = process.hrtime(start);
  const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
  response.headers["request-duration"] = milliseconds;
  return response;
});

export { axiosDefaultInstance as axiosDefault };

export const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:55.0) Gecko/20100101 Firefox/55.0",
};
