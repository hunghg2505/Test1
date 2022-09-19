import { AxiosRequestConfig } from "axios";

const interceptor = async (config: AxiosRequestConfig) => {
  if (config.headers === undefined) {
    config.headers = {};
  }
  const accessToken = localStorage.getItem("token");
  config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
};

export default interceptor;
