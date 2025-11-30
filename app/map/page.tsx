import { getDb } from "@/lib/db";
import { Activity } from "@/app/types/Activity";
import Footer from "../components/Footer";
import MapWrapper from "./MapWrapper";

export const dynamic = 'force-dynamic';

async function getActivities(): Promise<Activity[]> {
  const db = await getDb();
  const result = await db.request().query(
    "SELECT * FROM activities ORDER BY start_date DESC"
  );
  return result.recordset;
}

export default async function Page() {
  const activities = await getActivities();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {activities.length > 0 ? (
        <div className="w-full row-start-2 flex gap-6 flex-wrap items-center justify-center">
          <MapWrapper activities={activities} />
        </div>
      ) : (
        <p>No activities found. Try syncing from Strava.</p>
      )}
      <Footer />
    </div>
  );
}
