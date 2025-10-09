import { ResponseData } from "@/types";
import { SortState, SortKey } from "@/types/table";

export function sortResponses(items: ResponseData[], sort: SortState): ResponseData[] {
  return [...items].sort((a, b) => {
    let av: number = 0;
    let bv: number = 0;
    
    if (sort.key === "timestamp") {
      av = new Date(a.timestamp).getTime();
      bv = new Date(b.timestamp).getTime();
    } else if (sort.key === "status") {
      av = a.response.status;
      bv = b.response.status;
    } else {
      av = a.response.latency;
      bv = b.response.latency;
    }
    
    return sort.order === "asc" ? av - bv : bv - av;
  });
}