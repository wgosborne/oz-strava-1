// app/api/refreshDatabase/stravaToDatabase/route.ts

import { NextRequest } from 'next/server';
import sql from 'mssql';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const { activities } = await req.json();

    console.log('coming from refreshDatabase route.ts', activities);

    let upserted = 0;

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

      const request = db.request()
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
        .input('raw_json', sql.NVarChar(sql.MAX), JSON.stringify(activity));

      await request.query(`
        MERGE activities AS target
        USING (SELECT
          @id AS id,
          @name AS name,
          @type AS type,
          @start_date AS start_date,
          @distance AS distance,
          @moving_time AS moving_time,
          @elapsed_time AS elapsed_time,
          @average_speed AS average_speed,
          @max_speed AS max_speed,
          @total_elevation_gain AS total_elevation_gain,
          @kudos_count AS kudos_count,
          @comment_count AS comment_count,
          @gear_id AS gear_id,
          @visibility AS visibility,
          @location_city AS location_city,
          @location_state AS location_state,
          @location_country AS location_country,
          @summary_polyline AS summary_polyline,
          @start_lat AS start_lat,
          @start_lng AS start_lng,
          @end_lat AS end_lat,
          @end_lng AS end_lng,
          @athlete_id AS athlete_id,
          @raw_json AS raw_json
        ) AS source
        ON target.id = source.id

        WHEN MATCHED THEN
          UPDATE SET
            name = source.name,
            type = source.type,
            start_date = source.start_date,
            distance = source.distance,
            moving_time = source.moving_time,
            elapsed_time = source.elapsed_time,
            average_speed = source.average_speed,
            max_speed = source.max_speed,
            total_elevation_gain = source.total_elevation_gain,
            kudos_count = source.kudos_count,
            comment_count = source.comment_count,
            gear_id = source.gear_id,
            visibility = source.visibility,
            location_city = source.location_city,
            location_state = source.location_state,
            location_country = source.location_country,
            summary_polyline = source.summary_polyline,
            start_lat = source.start_lat,
            start_lng = source.start_lng,
            end_lat = source.end_lat,
            end_lng = source.end_lng,
            athlete_id = source.athlete_id,
            raw_json = source.raw_json

        WHEN NOT MATCHED THEN
          INSERT (
            id, name, type, start_date, distance, moving_time, elapsed_time,
            average_speed, max_speed, total_elevation_gain, kudos_count, comment_count,
            gear_id, visibility, location_city, location_state, location_country,
            summary_polyline, start_lat, start_lng, end_lat, end_lng, athlete_id, raw_json
          ) VALUES (
            source.id, source.name, source.type, source.start_date, source.distance,
            source.moving_time, source.elapsed_time, source.average_speed, source.max_speed,
            source.total_elevation_gain, source.kudos_count, source.comment_count,
            source.gear_id, source.visibility, source.location_city, source.location_state,
            source.location_country, source.summary_polyline, source.start_lat,
            source.start_lng, source.end_lat, source.end_lng, source.athlete_id, source.raw_json
          );
      `);

      upserted++;
    }

    return new Response(
      JSON.stringify({ message: `Sync complete. ${upserted} activities inserted or updated.` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Server error', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
