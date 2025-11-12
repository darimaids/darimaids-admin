import { privateApi, publicApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const bookingStat = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/total-bookings");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const revenueStat = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/total-revenue");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const userStat = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/total-users");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const workerStat = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/total-workers");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const jobCleaningService = async () => {
  try {
    const response = await privateApi.get(
      "/api/v1/admin/job-cleaning-service-graphs"
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const revenueChart = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/revenue-graphs");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const recentBookings = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/all-recent-bookings");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};
