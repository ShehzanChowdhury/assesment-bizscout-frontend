import DashboardClient from "@/features/dashboard/DashboardClient";
import { fetchStats } from "@/@services/http";

export default async function Home() {
  let stats = null;
  try {
    stats = await fetchStats({ cache: "no-store" });
  } catch (error) {
    console.error("Error fetching stats on server:", error);
  }
  
  return <DashboardClient initialStats={stats} />;
}
