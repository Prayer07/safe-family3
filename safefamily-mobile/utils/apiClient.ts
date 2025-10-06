// utils/apiClient.ts
import { getToken, removeToken } from "./secureStore";
import { router } from "expo-router";
import config from "./config";

const API_BASE_URL = config.API_URL;

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = await getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Parse response
    let data: any;
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = await res.json();
    }

    // Handle errors
    if (!res.ok) {
      // Extract error message from backend
      const errorMessage = data?.message || `Request failed with status ${res.status}`;
      
      // Handle 401 specially (unauthorized)
      if (res.status === 401) {
        await removeToken();
        if (endpoint !== "/auth/login") {
          router.replace("/login");
        }
      }
      
      throw new ApiError(res.status, errorMessage);
    }

    return data as T;
  } catch (error) {
    // Network errors
    if (error instanceof TypeError && error.message === "Network request failed") {
      throw new ApiError(0, "Network error. Please check your internet connection.");
    }
    
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Unknown errors
    throw new ApiError(500, "An unexpected error occurred");
  }
}


// // utils/apiClient.ts
// import { getToken, removeToken } from "./secureStore";
// import { router } from "expo-router";
// import config from "./config";

// const API_BASE_URL = config.API_URL;

// // Generic API fetcher
// export async function apiFetch<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token = await getToken();

//   const headers: HeadersInit = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...options.headers,
//   };

//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   if (res.status === 401) {
//     await removeToken();
//     router.replace("/login");
//     throw new Error("Session expired. Please log in again.");
//   }

//   if (!res.ok) {
//     let errMsg = "Something went wrong";
//     try {
//       const errData = await res.json();
//       errMsg = errData.message || errMsg;
//     } catch {}
//     throw new Error(errMsg);
//   }

  

//   return res.json() as Promise<T>;
// }