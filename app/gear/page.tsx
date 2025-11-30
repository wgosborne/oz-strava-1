import { getDb } from "@/lib/db";
import GearList from "./GearList";

export const dynamic = 'force-dynamic';

interface GearItem {
  gear_id: string;
  name: string;
  brand_name: string | null;
  model_name: string | null;
  nickname: string | null;
  description: string | null;
  distance: number;
  converted_distance: number;
  notification_distance: number;
  is_primary: boolean;
  retired: boolean;
  resource_state: number;
  image_path: string | null;
}

async function getGear(): Promise<GearItem[]> {
  const db = await getDb();
  const result = await db.request().query(
    "SELECT * FROM gear ORDER BY name ASC"
  );
  return result.recordset;
}

export default async function Page() {
  const gear = await getGear();

  if (gear.length === 0) {
    return (
      <div className="p-4">
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <p>No gear found. Try syncing from Strava.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex items-center space-x-4"></div>
        <GearList gear={gear} />
      </div>
    </div>
  );
}
