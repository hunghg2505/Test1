import axios from "axios";
import { apiEndpoint } from "./config";
import interceptor from "./interceptor/interceptor";

const MainAPI = axios.create({
  baseURL: apiEndpoint.endpoint,
  headers: {
    "content-type": "application/json",
  },
});

MainAPI.interceptors.request.use(interceptor);

export default MainAPI;
