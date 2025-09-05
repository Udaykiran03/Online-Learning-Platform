import axios from "axios";
import { toastMessage } from "../constants/toastMessage";

const mainAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_BASE_URL,
  timeout: 15000,
  timeoutErrorMessage: toastMessage.SERVER_NOT_RESPONDING,
});

export default mainAxiosInstance;
