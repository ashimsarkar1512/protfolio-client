import DashboardOverview from "@/components/dashboard-overview";
import { get_dashboard_data } from "@/server/auth";

export default async function DashboardPage() {
  const result = await get_dashboard_data();
  return <DashboardOverview data={result?.data} />;
}
