import { API_BASE_URL } from "@/@config";
import { ApiResponse, Stats } from "@/types";

export async function fetchStatsServer(): Promise<Stats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/responses/stats`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch stats:", res.statusText);
      return null;
    }

    const apiResponse = await res.json() as ApiResponse<Stats>;
    
    if (!apiResponse.success || !apiResponse.data) {
      console.error("API error:", apiResponse.error?.message || "Unknown error");
      return null;
    }
    
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}
