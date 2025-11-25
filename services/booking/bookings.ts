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

export const createBooking = async (data: any) => {
  try {
    const response = await publicApi.post(
      "/api/v1/booking/createBookingPayment",
      data
    );
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw new Error(extractErrorMessage(error));
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
    console.log("Error assigning booking:", error);
    throw extractErrorMessage(error);
  }
};

export const revokeCleanerFromBooking = async (uid: any, buid: any) => {
  try {
    const response = await privateApi.post(
      `/api/v1/admin/revoke-booking-from-cleaner?workerId=${uid}&bookingId=${buid}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error revoking booking:", error);
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
    console.log("Error assigning booking:", error);
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
    console.log("Error deleting booking:", error);
    throw extractErrorMessage(error);
  }
};
