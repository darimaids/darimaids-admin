import { privateApi, publicApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const getDisbursement = async () => {
  try {
    const response = await privateApi.get(
      "/api/v1/admin/adminWorkerPaymentDetails"
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching booking:", error);
    throw extractErrorMessage(error);
  }
};
