import { privateApi, publicApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const login = async (data: any) => {
  try {
    const response = await publicApi.post("/api/v1/user/login", data);
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error loggin in:", error);
    throw extractErrorMessage(error);
  }
};

export const createCustomer = async (data: any) => {
  try {
    const response = await publicApi.post(
      "/api/v1/user/register-customer",
      data
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const createCleaner = async (data: any) => {
  try {
    const response = await publicApi.post("/api/v1/user/register-worker", data);
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const otpVerification = async (code: any) => {
  try {
    const response = await publicApi.post(
      `/api/v1/user/email-verification?token=${code}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const forgotPassword = async (data: any) => {
  try {
    const response = await publicApi.post(
      "/api/v1/booking/createBookingPayment",
      data
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const resetPasssword = async (data: any) => {
  try {
    const response = await publicApi.post(
      "/api/v1/booking/createBookingPayment",
      data
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const changePassword = async (data: any) => {
  try {
    const response = await publicApi.post(
      "/api/v1/booking/createBookingPayment",
      data
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const viewProfile = async () => {
  try {
    const response = await privateApi.get("/api/v1/user/view-profile");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};
