import axios from "axios";
import { apiEndpoint } from "./config";
import interceptor from "./interceptor/interceptor";

const ActivityLogAPI = axios.create({
  baseURL: apiEndpoint.activityLogEndpoint,
});

ActivityLogAPI.interceptors.request.use(interceptor);

export default ActivityLogAPI;
