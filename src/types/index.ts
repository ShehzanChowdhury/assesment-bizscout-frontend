export interface ResponseData {
  _id: string;
  timestamp: string; // serialized from server; convert to Date in UI if needed
  requestPayload: Record<string, unknown>;
  response: {
    status: number;
    statusText: string;
    headers: Record<string, unknown>;
    data: Record<string, unknown>;
    latency: number;
  };
  error?: {
    message: string;
    code?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: {
    pagination?: PaginationMeta;
  } | null;
}

export interface Stats {
  total: number;
  successRate: number;
  avgLatency: number;
  lastPingTime?: string;
}

export interface PaginatedResponses {
  items: ResponseData[];
  meta: PaginationMeta;
}

