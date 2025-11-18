import { privateApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const createFaq = async (data: any) => {
  try {
    const response = await privateApi.post("/api/v1/faq/createFaq", data);
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const getFaqs = async () => {
  try {
    const response = await privateApi.get("/api/v1/faq/getFaqs");
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const viewFaq = async (uid: string) => {
  try {
    const response = await privateApi.get(`/api/v1/faq/getFaqById/${uid}`);
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const editFaq = async (uid: string, data: any) => {
  try {
    const response = await privateApi.put(`/api/v1/faq/updateFaq/${uid}`, data);
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const deleteFaq = async (uid: string) => {
  try {
    const response = await privateApi.delete(`/api/v1/faq/deleteFaq/${uid}`);
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};
