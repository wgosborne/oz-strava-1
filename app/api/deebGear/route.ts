import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDb } from '@/lib/db';

// GET: /api/gear or /api/gear?gear_id=g123
export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const gear_id = searchParams.get('gear_id');

  try {
    if (gear_id) {
      const result = await db.request()
        .input('gear_id', sql.NVarChar(50), gear_id)
        .query('SELECT * FROM gear WHERE gear_id = @gear_id');

      if (result.recordset.length === 0) {
        return NextResponse.json({ message: 'Gear not found' }, { status: 404 });
      }

      return NextResponse.json(result.recordset[0], { status: 200 });
    } else {
      const result = await db.request()
        .query('SELECT * FROM gear ORDER BY name ASC');

      return NextResponse.json(result.recordset, { status: 200 });
    }
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

// PUT: update a gear item
export async function PUT(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();

  const {
    gear_id,
    name,
    nickname,
    description,
    image_path
  } = body;

  if (!gear_id) {
    return NextResponse.json({ message: 'Gear ID is required' }, { status: 400 });
  }

  try {
    await db.request()
      .input('gear_id', sql.NVarChar(50), gear_id)
      .input('name', sql.NVarChar(255), name)
      .input('nickname', sql.NVarChar(100), nickname)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('image_path', sql.NVarChar(255), image_path)
      .query(`
        UPDATE gear
        SET
          name = @name,
          nickname = @nickname,
          description = @description,
          image_path = @image_path
        WHERE gear_id = @gear_id
      `);

    return NextResponse.json({ message: 'Gear updated' }, { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

// DELETE: /api/gear?gear_id=g123
export async function DELETE(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const gear_id = searchParams.get('gear_id');

  if (!gear_id) {
    return NextResponse.json({ message: 'Gear ID is required' }, { status: 400 });
  }

  try {
    await db.request()
      .input('gear_id', sql.NVarChar(50), gear_id)
      .query('DELETE FROM gear WHERE gear_id = @gear_id');

    return NextResponse.json({ message: 'Gear deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
