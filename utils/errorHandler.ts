import { AxiosError } from "axios";

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const axiosMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    return axiosMessage || "A network or server error occurred.";
  }

  if (error instanceof Error) {
    return error.message || "An unexpected error occurred.";
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "An unexpected error occurred.";
  }
};
