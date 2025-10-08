import { fetchStats } from "./http";
import { Stats } from "@/types";

/**
 * Server-side wrapper for fetching stats
 * Returns null on error instead of throwing (for graceful SSR degradation)
 */
export async function fetchStatsServer(): Promise<Stats | null> {
  try {
    return await fetchStats({ cache: "no-store" });
  } catch (error) {
    console.error("Error fetching stats on server:", error);
    return null;
  }
}
