import { privateApi, publicApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const bookings = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/all-bookings");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching booking:", error);
    throw extractErrorMessage(error);
  }
};

export const viewBooking = async (uid: any) => {
  try {
    const response = await privateApi.get(
      `/api/v1/admin/booking?bookingId=${uid}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching booking:", error);
    throw extractErrorMessage(error);
  }
};

export const assignBooking = async (uid: any, buid: any) => {
  try {
    const response = await privateApi.post(
      `/api/v1/admin/assign-booking-to-cleaner?bookingId=${uid}&workerId=${buid}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching booking:", error);
    throw extractErrorMessage(error);
  }
};

export const assignBookingToMultipleCleaners = async (data: any) => {
  try {
    const response = await privateApi.post(
      `/api/v1/admin/adminAssignBookingToMultipleCleaners`,
      data
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching booking:", error);
    throw extractErrorMessage(error);
  }
};

export const deleteBooking = async (uid: any) => {
  try {
    const response = await privateApi.delete(
      `/api/v1/admin/deleteBooking?bookingId=${uid}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching booking:", error);
    throw extractErrorMessage(error);
  }
};
