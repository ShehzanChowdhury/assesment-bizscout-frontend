import DashboardClient from "@/features/dashboard/DashboardClient";
import { fetchStatsServer } from "@/@services/server-http";

export default async function Home() {
  const stats = await fetchStatsServer();
  
  return <DashboardClient initialStats={stats} />;
}
