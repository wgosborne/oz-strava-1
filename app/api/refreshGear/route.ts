import { NextRequest } from 'next/server';
import sql from 'mssql';
import { getDb } from '@/lib/db';

// Upsert gear data into the database
export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const { gear } = await req.json();

    console.log('Incoming gear data:', gear);

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
        primary,
        retired,
        resource_state,
        image_path = null,
      } = item;

      const request = db.request()
        .input('gear_id', sql.NVarChar(50), id)
        .input('name', sql.NVarChar(255), name)
        .input('brand_name', sql.NVarChar(100), brand_name)
        .input('model_name', sql.NVarChar(100), model_name)
        .input('nickname', sql.NVarChar(100), nickname)
        .input('description', sql.NVarChar(sql.MAX), description)
        .input('distance', sql.BigInt, distance)
        .input('converted_distance', sql.Float, converted_distance)
        .input('notification_distance', sql.Int, notification_distance)
        .input('is_primary', sql.Bit, primary)
        .input('retired', sql.Bit, retired)
        .input('resource_state', sql.Int, resource_state)
        .input('image_path', sql.NVarChar(255), image_path);

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
            resource_state = source.resource_state,
            image_path = source.image_path

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

    return new Response(
      JSON.stringify({ message: `Gear sync complete. ${upserted} items inserted or updated.` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Gear sync error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
