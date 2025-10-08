import { API_BASE_URL } from "@/@config";
import { ApiResponse, PaginatedResponses, ResponseData, Stats } from "@/types";

/**
 * Base fetch wrapper with error handling
 * Works in both client and server components
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json() as ApiResponse<T>;
    return data;
  } catch (error) {
    // Re-throw with more context
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to fetch ${endpoint}: ${message}`);
  }
}

/**
 * Fetch paginated responses
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 */
export async function fetchResponses(
  page: number, 
  limit: number
): Promise<PaginatedResponses> {
  const apiResponse = await apiFetch<ResponseData[]>(
    `/api/responses?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );
  
  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.error?.message || 'Failed to fetch responses');
  }
  
  return {
    items: apiResponse.data,
    meta: apiResponse.meta?.pagination || {
      page,
      pageSize: limit,
      totalPages: 0,
      totalItems: 0
    }
  };
}

/**
 * Fetch statistics
 * Can be used in both client and server components
 */
export async function fetchStats(options?: { cache?: RequestCache }): Promise<Stats> {
  const apiResponse = await apiFetch<Stats>(
    "/api/responses/stats",
    { cache: options?.cache || "no-store" }
  );
  
  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.error?.message || 'Failed to fetch stats');
  }
  
  return apiResponse.data;
}

/**
 * Fetch a single response by ID
 * @param id - Response ID
 */
export async function fetchResponseById(id: string): Promise<ResponseData> {
  const apiResponse = await apiFetch<ResponseData>(
    `/api/responses/${id}`,
    { cache: "no-store" }
  );
  
  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(
      apiResponse.error?.message || `Response with id '${id}' not found.`
    );
  }
  
  return apiResponse.data;
}

