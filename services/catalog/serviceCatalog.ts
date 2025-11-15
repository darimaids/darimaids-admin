import { privateApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const createService = async (data: any) => {
  try {
    const response = await privateApi.post(
      "/api/v1/catalog/createCatalog",
      data
    );
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const getServices = async () => {
  try {
    const response = await privateApi.get("/api/v1/catalog/getAllCatalogs");
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const viewService = async (uid: string) => {
  try {
    const response = await privateApi.get(
      `/api/v1/catalog/getCatalogById/${uid}`
    );
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const editService = async (uid: string, data: any) => {
  try {
    const response = await privateApi.put(
      `/api/v1/catalog/updateCatalog/${uid}`,
      data
    );
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const deleteSService = async (uid: string) => {
  try {
    const response = await privateApi.delete(
      `/api/v1/catalog/deleteCatalog/${uid}`
    );
    return response?.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};
