import { privateApi, publicApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

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

export const allCleaners = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/all-cleaners");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching cleaners:", error);
    throw extractErrorMessage(error);
  }
};

export const viewCleaner = async (uid: any) => {
  try {
    const response = await privateApi.get(
      `/api/v1/admin/adminGetCleanerById/${uid}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching cleaner info:", error);
    throw extractErrorMessage(error);
  }
};

export const deleteCleaner = async (uid: any) => {
  try {
    const response = await privateApi.delete(
      `/api/v1/admin/deleteCleaner?cleanerId=${uid}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching cleaner info:", error);
    throw extractErrorMessage(error);
  }
};
