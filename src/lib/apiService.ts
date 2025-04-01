import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { z } from "zod";

// Constants
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const NETWORK_ERROR_STATUS = 504;
const INTERNAL_ERROR_STATUS = 500;

// Types
export type EmptyObj = Record<string, never>;

export type ApiServiceResponse<T = EmptyObj> = {
  status: number;
  statusText: string;
  data: T;
  success: boolean;
  error?: string;
  errors?: z.ZodError["errors"] | unknown[];
};

export type ErrorResponseData = {
  code?: string | number;
  message?: string;
  errors?: unknown[];
};

// Default configuration
const defaultConfig: AxiosRequestConfig = {
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status < 500, // Consider 5xx errors as failures
};

// Error utilities
const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && !!error.request;
};

const isTimeoutError = (error: AxiosError): boolean => {
  return error.code === "ECONNABORTED" || error.message.includes("timeout");
};

const getErrorResponseData = (error: AxiosError): ErrorResponseData => {
  if (error.response?.data && typeof error.response.data === "object") {
    return error.response.data as ErrorResponseData;
  }
  return {};
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = getErrorResponseData(error);
      return (
        data.message ||
        error.response.statusText ||
        `Request failed with status ${error.response.status}`
      );
    }
    if (isTimeoutError(error)) {
      return "Request timeout - please try again";
    }
    if (isNetworkError(error)) {
      return "Network error - please check your connection";
    }
  }
  if (error instanceof z.ZodError) {
    return "Validation error";
  }
  return (error as Error)?.message || "Unknown error occurred";
};

// Error handler
export const handleError = <T = EmptyObj>(
  error: unknown
): ApiServiceResponse<T> => {
  if (error instanceof z.ZodError) {
    return {
      status: 400,
      statusText: "Bad Request",
      data: { error: "Invalid input", details: error.errors } as T,
      success: false,
      error: "Validation error",
      errors: error.errors,
    };
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = getErrorResponseData(error);
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        data: (error.response.data ?? {}) as T,
        success: false,
        error: data.message || error.response.statusText,
        errors: data.errors,
      };
    }

    const isNetwork = isNetworkError(error);
    return {
      status: isNetwork ? NETWORK_ERROR_STATUS : INTERNAL_ERROR_STATUS,
      statusText: isNetwork ? "Network Error" : "Internal Server Error",
      data: {} as T,
      success: false,
      error: getErrorMessage(error),
    };
  }

  return {
    status: INTERNAL_ERROR_STATUS,
    statusText: "Internal Server Error",
    data: {} as T,
    success: false,
    error: getErrorMessage(error),
  };
};

const axiosInstance = axios.create(defaultConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify requests here (e.g., add auth token)
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can add global response error handling here
    return Promise.reject(error);
  }
);

export const apiService = async <T = unknown, D = unknown>(
  config: AxiosRequestConfig<D>
): Promise<ApiServiceResponse<T>> => {
  try {
    const response = await axiosInstance({
      ...defaultConfig,
      ...config,
    });

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      success: true,
    };
  } catch (error) {
    return handleError<T>(error);
  }
};

export const api = {
  get: <T = unknown, D = unknown>(
    url: string,
    params?: D,
    config?: AxiosRequestConfig
  ) => axiosInstance<T>({ ...config, method: "GET", url, params }),
  post: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) => axiosInstance<T>({ ...config, method: "POST", url, data }),
  put: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) => axiosInstance<T>({ ...config, method: "PUT", url, data }),
  patch: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) => axiosInstance<T>({ ...config, method: "PATCH", url, data }),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance<T>({ ...config, method: "DELETE", url }),
};

export default apiService;
