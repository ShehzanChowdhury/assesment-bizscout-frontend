import axiosInstance from "@/axiosinstance";
import { ApiResponse, PaginatedResponses, ResponseData, Stats } from "@/types";

export async function fetchResponses(page: number, limit: number) {
  const res = await axiosInstance.get<ApiResponse<ResponseData[]>>(
    `/api/responses?page=${page}&limit=${limit}`
  );
  
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message || 'Failed to fetch responses');
  }
  
  return {
    items: res.data.data,
    meta: res.data.meta?.pagination || {
      page,
      pageSize: limit,
      totalPages: 0,
      totalItems: 0
    }
  } as PaginatedResponses;
}

export async function fetchStats() {
  const res = await axiosInstance.get<ApiResponse<Stats>>("/api/responses/stats");
  
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message || 'Failed to fetch stats');
  }
  
  return res.data.data;
}

export async function fetchResponseById(id: string) {
  const res = await axiosInstance.get<ApiResponse<ResponseData>>(`/api/responses/${id}`);
  
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message || `Response with id '${id}' not found.`);
  }
  
  return res.data.data;
}

