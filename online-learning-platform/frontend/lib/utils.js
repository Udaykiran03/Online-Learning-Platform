import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { jwtDecode } from "jwt-decode";
import { logMessage } from "../src/constants/logMessage";
import { toast } from "sonner";

export default function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function decodeAndValidateToken(token) {
  try {
    const decoded = jwtDecode(token);
    const isValid = decoded && decoded?.exp * 1000 > Date.now();

    return {
      decodedToken: decoded,
      isValidToken: isValid,
    };
  } catch (error) {
    import.meta.env.VITE_APP_ENV === "development" &&
      console.error("Invalid token:", error.message);

    return {
      decodedToken: null,
      isValidToken: false,
    };
  }
}

const errors = {
  400: logMessage.BAD_REQUEST,
  401: logMessage.UN_AUTHORIZED,
  403: logMessage.PERMISSION_DENIED,
  404: logMessage.INVALID_REQUEST,
  500: logMessage.SERVER_ERROR,
};

function getTheErrorMessage(status) {
  return errors[status];
}

export function handleErrorToast(error) {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    const errorMessage = error.response.data.message;
    toast.error(errorMessage, {
      id: "error",
    });
  } else {
    toast.error(getTheErrorMessage(error.status), {
      id: "server-err",
    });
  }
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
