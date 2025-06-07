import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDb } from '@/lib/db';

// GET: /api/activities or /api/activities?id=123
//merge statement to update the database
export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const result = await db.request()
        .input('id', sql.BigInt, id)
        .query('SELECT * FROM activities WHERE id = @id');

      if (result.recordset.length === 0) {
        return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
      }

      return NextResponse.json(result.recordset[0], { status: 200 });
    } else {
      const result = await db.request()
        .query('SELECT * FROM activities ORDER BY start_date DESC');

      return NextResponse.json(result.recordset, { status: 200 });
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

// PUT: update an activity
export async function PUT(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();

  console.log('coming from database route.ts');


  const {
    id,
    name,
    visibility,
    gear_id,
    location_city,
    location_state,
    location_country,
  } = body;

  if (!id) {
    return NextResponse.json({ message: 'Activity ID is required' }, { status: 400 });
  }

  try {
    await db.request()
      .input('id', sql.BigInt, id)
      .input('name', sql.NVarChar(255), name)
      .input('visibility', sql.NVarChar(50), visibility)
      .input('gear_id', sql.NVarChar(100), gear_id)
      .input('location_city', sql.NVarChar(100), location_city)
      .input('location_state', sql.NVarChar(100), location_state)
      .input('location_country', sql.NVarChar(100), location_country)
      .query(`
        UPDATE activities
        SET name = @name,
            visibility = @visibility,
            gear_id = @gear_id,
            location_city = @location_city,
            location_state = @location_state,
            location_country = @location_country
        WHERE id = @id
      `);

    return NextResponse.json({ message: 'Activity updated' }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

// DELETE: /api/activities?id=123
export async function DELETE(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Activity ID is required' }, { status: 400 });
  }

  try {
    await db.request()
      .input('id', sql.BigInt, id)
      .query('DELETE FROM activities WHERE id = @id');

    return NextResponse.json({ message: 'Activity deleted' }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
