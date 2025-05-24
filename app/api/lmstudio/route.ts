// app/api/lmstudio/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const lmstudioResponse = await fetch('http://localhost:1234/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await lmstudioResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('LM Studio Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to LM Studio' },
      { status: 500 }
    );
  }
}
