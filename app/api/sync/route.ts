import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDb } from '@/lib/db';
import axios from 'axios';

const STRAVA_API = 'https://www.strava.com/api/v3';
const STRAVA_OAUTH = 'https://www.strava.com/oauth/token';

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  start_date: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  average_speed: number;
  max_speed: number;
  total_elevation_gain: number;
  kudos_count: number;
  comment_count: number;
  gear_id: string | null;
  visibility: string;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  start_latlng: [number, number] | null;
  end_latlng: [number, number] | null;
  athlete: { id: number };
  map: { summary_polyline: string } | null;
  description?: string;
}

interface StravaGear {
  id: string;
  name: string;
  brand_name: string | null;
  model_name: string | null;
  nickname: string | null;
  description: string | null;
  distance: number;
  converted_distance: number;
  notification_distance: number;
  primary: boolean;
  retired: boolean;
  resource_state: number;
}

async function getAccessToken(): Promise<string> {
  const response = await axios.post(STRAVA_OAUTH, null, {
    params: {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    },
  });
  return response.data.access_token;
}

async function fetchActivitiesFromStrava(accessToken: string): Promise<StravaActivity[]> {
  // Fetch activities list
  const response = await axios.get(`${STRAVA_API}/athlete/activities`, {
    params: {
      access_token: accessToken,
      after: 1761300309,
      per_page: 200,
    },
  });

  const activities: StravaActivity[] = response.data;
  const activitiesWithDescriptions: StravaActivity[] = [];

  // Fetch detailed info for each activity to get description
  for (const activity of activities) {
    try {
      const detailedResponse = await axios.get(
        `${STRAVA_API}/activities/${activity.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      activitiesWithDescriptions.push({
        ...activity,
        description: detailedResponse.data.description || '',
      });
    } catch (err) {
      console.error(`Error fetching details for activity ${activity.id}:`, err);
      activitiesWithDescriptions.push(activity);
    }
  }

  return activitiesWithDescriptions;
}

async function fetchGearFromStrava(
  accessToken: string,
  gearIds: string[]
): Promise<StravaGear[]> {
  const gearArray: StravaGear[] = [];

  for (const gearId of gearIds) {
    try {
      const response = await axios.get(`${STRAVA_API}/gear/${gearId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      gearArray.push(response.data);
    } catch (err) {
      console.error(`Error fetching gear ${gearId}:`, err);
    }
  }

  return gearArray;
}

async function upsertActivities(
  db: sql.ConnectionPool,
  activities: StravaActivity[]
): Promise<number> {
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
      athlete: { id: athlete_id } = { id: null },
      map: { summary_polyline } = { summary_polyline: null },
    } = activity;

    const [start_lat, start_lng] = start_latlng || [null, null];
    const [end_lat, end_lng] = end_latlng || [null, null];

    const request = db
      .request()
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
      .input('description', sql.NVarChar(sql.MAX), description);

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

  return upserted;
}

async function upsertGear(
  db: sql.ConnectionPool,
  gear: StravaGear[]
): Promise<number> {
  let upserted = 0;

  for (const item of gear) {
    const {
      id,
      name,
      brand_name,
      model_name,
      nickname,
      description,
      distance,
      converted_distance,
      notification_distance,
      primary: isPrimary,
      retired,
      resource_state,
    } = item;

    const request = db
      .request()
      .input('gear_id', sql.NVarChar(50), id)
      .input('name', sql.NVarChar(255), name)
      .input('brand_name', sql.NVarChar(100), brand_name)
      .input('model_name', sql.NVarChar(100), model_name)
      .input('nickname', sql.NVarChar(100), nickname)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('distance', sql.BigInt, distance)
      .input('converted_distance', sql.Float, converted_distance)
      .input('notification_distance', sql.Int, notification_distance)
      .input('is_primary', sql.Bit, isPrimary)
      .input('retired', sql.Bit, retired)
      .input('resource_state', sql.Int, resource_state)
      .input('image_path', sql.NVarChar(255), null);

    await request.query(`
      MERGE gear AS target
      USING (SELECT
        @gear_id AS gear_id,
        @name AS name,
        @brand_name AS brand_name,
        @model_name AS model_name,
        @nickname AS nickname,
        @description AS description,
        @distance AS distance,
        @converted_distance AS converted_distance,
        @notification_distance AS notification_distance,
        @is_primary AS is_primary,
        @retired AS retired,
        @resource_state AS resource_state,
        @image_path AS image_path
      ) AS source
      ON target.gear_id = source.gear_id

      WHEN MATCHED THEN
        UPDATE SET
          name = source.name,
          brand_name = source.brand_name,
          model_name = source.model_name,
          nickname = source.nickname,
          description = source.description,
          distance = source.distance,
          converted_distance = source.converted_distance,
          notification_distance = source.notification_distance,
          is_primary = source.is_primary,
          retired = source.retired,
          resource_state = source.resource_state

      WHEN NOT MATCHED THEN
        INSERT (
          gear_id, name, brand_name, model_name, nickname, description,
          distance, converted_distance, notification_distance, is_primary,
          retired, resource_state, image_path
        ) VALUES (
          source.gear_id, source.name, source.brand_name, source.model_name,
          source.nickname, source.description, source.distance,
          source.converted_distance, source.notification_distance,
          source.is_primary, source.retired, source.resource_state,
          source.image_path
        );
    `);

    upserted++;
  }

  return upserted;
}

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET || !process.env.STRAVA_REFRESH_TOKEN) {
      throw new Error('Strava credentials not configured. Check STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REFRESH_TOKEN environment variables.');
    }

    console.log('Starting Strava sync...');

    // 1. Get access token
    const accessToken = await getAccessToken();
    console.log('Got access token');

    // 2. Fetch activities from Strava
    const activities = await fetchActivitiesFromStrava(accessToken);
    console.log(`Fetched ${activities.length} activities from Strava`);

    // 3. Extract unique gear IDs from activities
    const gearIds = [
      ...new Set(
        activities
          .map((a) => a.gear_id)
          .filter((id): id is string => id !== null && id !== undefined)
      ),
    ];
    console.log(`Found ${gearIds.length} unique gear IDs`);

    // 4. Fetch gear from Strava
    const gear = await fetchGearFromStrava(accessToken, gearIds);
    console.log(`Fetched ${gear.length} gear items from Strava`);

    // 5. Get database connection
    const db = await getDb();

    // 6. Upsert activities to database
    const activitiesSynced = await upsertActivities(db, activities);
    console.log(`Synced ${activitiesSynced} activities to database`);

    // 7. Upsert gear to database
    const gearSynced = await upsertGear(db, gear);
    console.log(`Synced ${gearSynced} gear items to database`);

    return NextResponse.json({
      success: true,
      activitiesSynced,
      gearSynced,
      message: `Sync completed successfully. ${activitiesSynced} activities and ${gearSynced} gear items synced.`,
    });
  } catch (error) {
    console.error('Sync error:', error);

    // Handle specific error types
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: 'Strava authentication failed. Your refresh token may have expired.',
          },
          { status: 401 }
        );
      }
      if (error.response?.status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: 'Strava rate limit exceeded. Please try again later.',
          },
          { status: 429 }
        );
      }
    }

    const message = error instanceof Error ? error.message : 'Unknown error during sync';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
