import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

export type ApiServiceResponse<T = EmptyObj> = Pick<
  AxiosResponse<T>,
  "status" | "statusText" | "data"
> & {
  success: boolean;
  error?: string;
};

export type EmptyObj = Record<string, never>;

const defaultConfig: AxiosRequestConfig = {
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && error.request;
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return (
        error.response.data?.message ||
        error.response.statusText ||
        `Request failed with status ${error.response.status}`
      );
    }
    if (isNetworkError(error)) {
      return "Network error - please check your connection";
    }
  }
  return (error as Error)?.message || "Unknown error occurred";
};

export const handleAxiosError = <T = EmptyObj>(
  error: unknown
): ApiServiceResponse<T> => {
  console.error("API Service Error:", error);

  if (axios.isAxiosError(error)) {
    if (error.response) {
      if (error.response?.status === 401) {
        return {
          status: 401,
          statusText: "Unauthorized",
          data: {} as T,
          success: false,
          error: "Unauthorized access - check your authentication credentials.",
        };
      }

      if (error.response?.status === 403) {
        return {
          status: 403,
          statusText: "Forbidden",
          data: {} as T,
          success: false,
          error:
            "Access denied - you don't have permission to access this resource.",
        };
      }

      if (error.response?.status === 404) {
        return {
          status: 404,
          statusText: "Not Found",
          data: {} as T,
          success: false,
          error: "The requested resource could not be found.",
        };
      }

      if (error.response?.data?.code) {
        return {
          status: error.response.status,
          statusText: error.response.statusText,
          data: {} as T,
          success: false,
          error: `Error ${error.response.data.code}: ${error.response.data.message}`,
        };
      }
    }

    return {
      status: isNetworkError(error) ? 504 : 500,
      statusText: isNetworkError(error) ? "Request timeout" : "Internal error",
      data: {} as T,
      success: false,
      error: getErrorMessage(error),
    };
  }

  return {
    status: 500,
    statusText: "Internal Server Error",
    data: {} as T,
    success: false,
    error: getErrorMessage(error),
  };
};

const axiosInstance = axios.create(defaultConfig);

const apiService = async <T = unknown>(
  config: AxiosRequestConfig
): Promise<ApiServiceResponse<T>> => {
  const mergedConfig = { ...defaultConfig, ...config };
  try {
    const response = await axiosInstance(mergedConfig);
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      success: true,
    };
  } catch (error) {
    return handleAxiosError<T>(error);
  }
};

export default apiService;
