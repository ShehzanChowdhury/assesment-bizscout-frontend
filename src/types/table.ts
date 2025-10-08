export type SortKey = "timestamp" | "status" | "latency";
export type SortOrder = "asc" | "desc";

export interface SortState {
  key: SortKey;
  order: SortOrder;
}
