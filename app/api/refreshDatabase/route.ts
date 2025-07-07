// app/api/refreshDatabase/stravaToDatabase/route.ts

import { NextRequest } from 'next/server';
import sql from 'mssql';
import { getDb } from '@/lib/db';

//merging to DB

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
        description,
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
        .input('raw_json', sql.NVarChar(sql.MAX), JSON.stringify(activity))
        .input('description', sql.NVarChar(sql.MAX), description);;

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
          @raw_json AS raw_json,
          @description as description
        ) AS source
        ON target.id = source.id

        WHEN MATCHED THEN
          UPDATE SET
            name = COALESCE(source.name, target.name),
            type = COALESCE(source.type, target.type),
            start_date = COALESCE(source.start_date, target.start_date),
            distance = COALESCE(source.distance, target.distance),
            moving_time = COALESCE(source.moving_time, target.moving_time),
            elapsed_time = COALESCE(source.elapsed_time, target.elapsed_time),
            average_speed = COALESCE(source.average_speed, target.average_speed),
            max_speed = COALESCE(source.max_speed, target.max_speed),
            total_elevation_gain = COALESCE(source.total_elevation_gain, target.total_elevation_gain),
            kudos_count = COALESCE(source.kudos_count, target.kudos_count),
            comment_count = COALESCE(source.comment_count, target.comment_count),
            gear_id = COALESCE(source.gear_id, target.gear_id),
            visibility = COALESCE(source.visibility, target.visibility),
            location_city = COALESCE(source.location_city, target.location_city),
            location_state = COALESCE(source.location_state, target.location_state),
            location_country = COALESCE(source.location_country, target.location_country),
            summary_polyline = COALESCE(source.summary_polyline, target.summary_polyline),
            start_lat = COALESCE(source.start_lat, target.start_lat),
            start_lng = COALESCE(source.start_lng, target.start_lng),
            end_lat = COALESCE(source.end_lat, target.end_lat),
            end_lng = COALESCE(source.end_lng, target.end_lng),
            athlete_id = COALESCE(source.athlete_id, target.athlete_id),
            raw_json = COALESCE(source.raw_json, target.raw_json),
            description = COALESCE(source.description, target.description)

        WHEN NOT MATCHED THEN
          INSERT (
            id, name, type, start_date, distance, moving_time, elapsed_time,
            average_speed, max_speed, total_elevation_gain, kudos_count, comment_count,
            gear_id, visibility, location_city, location_state, location_country,
            summary_polyline, start_lat, start_lng, end_lat, end_lng, athlete_id, raw_json, description
          ) VALUES (
            source.id, source.name, source.type, source.start_date, source.distance,
            source.moving_time, source.elapsed_time, source.average_speed, source.max_speed,
            source.total_elevation_gain, source.kudos_count, source.comment_count,
            source.gear_id, source.visibility, source.location_city, source.location_state,
            source.location_country, source.summary_polyline, source.start_lat,
            source.start_lng, source.end_lat, source.end_lng, source.athlete_id, source.raw_json, source.description
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
