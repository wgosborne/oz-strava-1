// app/api/refreshDatabase/stravaToDatabase/route.ts

import { NextRequest } from 'next/server';
import sql from 'mssql';
import { getDb } from '@/lib/db';
//import { getAllActivities } from '@/app/actions/getActivities';

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const { activities } = await req.json();

    console.log('coming from refreshDatabase route.ts', activities)

    let inserted = 0;
    for (const activity of activities) {
      const {
        id,
        name,
        type,
        start_date,
        distance,
        moving_time,
        elapsed_time,
        average_speed,
        max_speed,
        total_elevation_gain,
        kudos_count,
        comment_count,
        gear_id,
        visibility,
        location_city,
        location_state,
        location_country,
        start_latlng,
        end_latlng,
        athlete: { id: athlete_id } = {},
        map: { summary_polyline } = {},
      } = activity;

      const [start_lat, start_lng] = start_latlng || [null, null];
      const [end_lat, end_lng] = end_latlng || [null, null];

      const result = await db.request()
        .input('id', sql.BigInt, id)
        .query('SELECT 1 FROM activities WHERE id = @id');

      if (result.recordset.length > 0) {
        continue; // already exists
      }

      await db.request()
        .input('id', sql.BigInt, id)
        .input('name', sql.NVarChar(255), name)
        .input('type', sql.NVarChar(50), type)
        .input('start_date', sql.DateTime, new Date(start_date))
        .input('distance', sql.Float, distance)
        .input('moving_time', sql.Int, moving_time)
        .input('elapsed_time', sql.Int, elapsed_time)
        .input('average_speed', sql.Float, average_speed)
        .input('max_speed', sql.Float, max_speed)
        .input('total_elevation_gain', sql.Float, total_elevation_gain)
        .input('kudos_count', sql.Int, kudos_count)
        .input('comment_count', sql.Int, comment_count)
        .input('gear_id', sql.NVarChar(100), gear_id)
        .input('visibility', sql.NVarChar(50), visibility)
        .input('location_city', sql.NVarChar(100), location_city)
        .input('location_state', sql.NVarChar(100), location_state)
        .input('location_country', sql.NVarChar(100), location_country)
        .input('summary_polyline', sql.NVarChar(sql.MAX), summary_polyline)
        .input('start_lat', sql.Float, start_lat)
        .input('start_lng', sql.Float, start_lng)
        .input('end_lat', sql.Float, end_lat)
        .input('end_lng', sql.Float, end_lng)
        .input('athlete_id', sql.BigInt, athlete_id)
        .input('raw_json', sql.NVarChar(sql.MAX), JSON.stringify(activity))
        .query(`
          INSERT INTO activities (
            id, name, type, start_date, distance, moving_time, elapsed_time,
            average_speed, max_speed, total_elevation_gain, kudos_count, comment_count,
            gear_id, visibility, location_city, location_state, location_country,
            summary_polyline, start_lat, start_lng, end_lat, end_lng, athlete_id, raw_json
          )
          VALUES (
            @id, @name, @type, @start_date, @distance, @moving_time, @elapsed_time,
            @average_speed, @max_speed, @total_elevation_gain, @kudos_count, @comment_count,
            @gear_id, @visibility, @location_city, @location_state, @location_country,
            @summary_polyline, @start_lat, @start_lng, @end_lat, @end_lng, @athlete_id, @raw_json
          )
        `);

      inserted++;
    }

    return new Response(
      JSON.stringify({ message: `Sync complete. Inserted ${inserted} new activities.` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Server error', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
