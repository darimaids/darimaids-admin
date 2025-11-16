import { privateApi, publicApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const allAdmins = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/all-cleaners");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching admins:", error);
    throw extractErrorMessage(error);
  }
};

export const blockAdminAccount = async (uid: any) => {
  try {
    const response = await privateApi.post(`/api/v1/admin/block-user/${uid}`);
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error blicking admin:", error);
    throw extractErrorMessage(error);
  }
};

export const createAdmin = async (data: any) => {
  try {
    const response = await privateApi.post(
      `api/v1/admin/adminRegisterWorker`,
      data
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating admni:", error);
    throw extractErrorMessage(error);
  }
};
