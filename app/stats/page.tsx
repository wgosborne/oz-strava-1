import { getDb } from "@/lib/db";
import { Activity } from "@/app/types/Activity";
import StatsChart from "./StatsChart";

interface ChartDataItem {
  title: string;
  distance: number;
}

async function getActivities(): Promise<Activity[]> {
  const db = await getDb();
  const result = await db.request().query(
    "SELECT * FROM activities ORDER BY start_date DESC"
  );
  return result.recordset;
}

function computeChartData(activities: Activity[]): ChartDataItem[] {
  return activities.map((activity) => ({
    title: activity.name,
    distance: activity.distance * 0.000621371, // Convert meters to miles
  }));
}

export default async function Page() {
  const activities = await getActivities();
  const chartData = computeChartData(activities);

  if (activities.length === 0) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <p>No activities found. Try syncing from Strava.</p>
      </div>
    );
  }

  return (
    <div>
      <StatsChart chartData={chartData} />
    </div>
  );
}
