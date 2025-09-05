import axios from "axios";
import LocalStorageRepository, { deleteUserInfo } from "../../lib/storage";
import { logMessage } from "../constants/logMessage";
import { decodeAndValidateToken, handleErrorToast } from "../../lib/utils";
import { toast } from "sonner";

const logOnDev = (message) => {
  if (import.meta.env.VITE_APP_ENV === "development") {
    console.log(message);
  }
};

const onRequest = (config) => {
  const { method, url, data } = config;
  const token = LocalStorageRepository.get("token");

  if (token) {
    const { isValidToken, decodedToken } = decodeAndValidateToken(token);
    if (isValidToken) {
      config.headers["User-Type"] = decodedToken.user.type;
    }
  }

  logOnDev(`🚀 [API] ${method?.toUpperCase()} ${url} | Request`);

  return config;
};

const onRequestError = (error) => {
  logOnDev(`🚨 [API] | Request Error: ${error.message}`);

  return Promise.reject(error);
};

const onResponse = (response) => {
  const { method, url } = response.config;
  const { status, data } = response;

  logOnDev(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`);

  if (data && data.token) {
    LocalStorageRepository.update("token", data.token);
  }

  if (data.message) {
    toast.success(data.message, {
      id: "success",
    });
  }

  return response;
};

const onResponseError = async (error) => {
  if (axios.isAxiosError(error)) {
    handleErrorToast(error);
    const { method, url } = error.config || {};
    const { status, message } = error.response || {};

    logOnDev(
      `🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`
    );

    switch (status) {
      case 400:
        logOnDev(logMessage.BAD_REQUEST);
        break;
      case 401:
        logOnDev(logMessage.UN_AUTHORIZED);
        toast.error("Unauthorised");
        break;
      case 403:
        logOnDev(logMessage.PERMISSION_DENIED);
        break;
      case 404:
        logOnDev(logMessage.INVALID_REQUEST);
        break;
      case 409:
        logOnDev(logMessage.CONFLICT);
        break;
      case 500:
        logOnDev(logMessage.SERVER_ERROR);
        deleteUserInfo();
        break;
      default:
        logOnDev(logMessage.UNKNOWN_ERROR);
        break;
    }
  } else {
    logOnDev(`🚨 [API] | Response Error ${error.message}`);
  }

  return await Promise.reject(error);
};

export const setupInterceptors = (instance) => {
  instance.interceptors.request.use(onRequest, onRequestError);
  instance.interceptors.response.use(onResponse, onResponseError);

  return instance;
};
