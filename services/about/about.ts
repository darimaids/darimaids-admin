import { privateApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const createAbout = async (data: any) => {
  try {
    const response = await privateApi.post(
      "/api/v1/aboutus/createAboutus",
      data
    );
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const getAbout = async () => {
  try {
    const response = await privateApi.get("/api/v1/aboutus/getAboutus");
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const getAboutById = async (uid: string) => {
  try {
    const response = await privateApi.get(
      `/api/v1/aboutus/getAboutusById/${uid}`
    );
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const editAbout = async (uid: string, data: any) => {
  try {
    const response = await privateApi.put(
      `api/v1/aboutus/updateAboutus/${uid}`,
      data
    );
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const deleteAbout = async (uid: string) => {
  try {
    const response = await privateApi.delete(
      `api/v1/aboutus/deleteAboutus/${uid}`
    );
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};
