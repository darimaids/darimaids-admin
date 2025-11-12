import { privateApi, publicApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const allBanks = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/all-banks");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching booking:", error);
    throw extractErrorMessage(error);
  }
};

export const viewBankInformation = async (uid: any) => {
  try {
    const response = await privateApi.get(`/api/v1/admin/bank?bankId=${uid}`);
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching booking:", error);
    throw extractErrorMessage(error);
  }
};
