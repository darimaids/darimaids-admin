import axios, { AxiosError, AxiosInstance } from "axios";

export const BASE_URL =
  process.env.NEXT_PUBLIC_DARIMAIDS_BASE_URL ||
  `https://1.11.1.darimaids:${
    process.env.NEXT_PUBLIC_DARIMAIDS_BASE_PORT || 5000
  }`;

const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const privateApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

privateApi.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("accessToken")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

//* this one i put here is optional: to hanndle expired/invalid tokens globally
privateApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Clearing session...");
      sessionStorage.removeItem("accessToken");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { publicApi, privateApi };
