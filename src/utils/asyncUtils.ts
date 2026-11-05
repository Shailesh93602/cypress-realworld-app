import axios from "axios";

const httpClient = axios.create({
  withCredentials: true,
});

// When VITE_API_BASE_URL is set (see .env), API calls go to that same-origin path instead of
// http://localhost:<backend port>, so the app works when only the frontend port is reachable.
const apiBaseUrl = process.env.VITE_API_BASE_URL;

httpClient.interceptors.request.use((config) => {
  if (apiBaseUrl && config.url) {
    config.url = config.url.replace(/^http:\/\/localhost:\d+/, apiBaseUrl);
  }
  /* istanbul ignore if */
  if (
    process.env.VITE_AUTH0 ||
    process.env.VITE_OKTA ||
    process.env.VITE_AWS_COGNITO ||
    process.env.VITE_GOOGLE
  ) {
    const accessToken = localStorage.getItem(process.env.VITE_AUTH_TOKEN_NAME!);
    // @ts-ignore
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export { httpClient };
