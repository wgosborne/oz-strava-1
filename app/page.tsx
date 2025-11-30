import { getDb } from "@/lib/db";
import { Activity } from "@/app/types/Activity";
import ActivityList from "./components/ActivityList";
import Footer from "./components/Footer";
import { SyncButton } from "./components/SyncButton";

async function getActivities(): Promise<Activity[]> {
  const db = await getDb();
  const result = await db.request().query(
    "SELECT * FROM activities ORDER BY start_date DESC"
  );
  return result.recordset;
}

export default async function Home() {
  const activities = await getActivities();

  if (activities.length === 0) {
    return (
      <div className="p-4">
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <div>
            <SyncButton />
            <p className="mt-4">No activities found. Try syncing from Strava.</p>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <SyncButton />
        <ActivityList activities={activities} />
        <Footer />
      </div>
    </div>
  );
}
