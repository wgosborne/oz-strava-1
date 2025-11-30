import { getDb } from "@/lib/db";
import { Activity } from "@/app/types/Activity";
import CoachChat from "./CoachChat";

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
    <div className="p-4">
      <CoachChat activities={activities} />
    </div>
  );
}
