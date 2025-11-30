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

    if (!lmstudioResponse.ok) {
      const errorText = await lmstudioResponse.text(); // try to get more details
      return NextResponse.json(
        { error: 'LM Studio responded with an error', details: errorText },
        { status: lmstudioResponse.status }
      );
    }

    const data = await lmstudioResponse.json();

    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('LM Studio Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to LM Studio. Is it running?', details: error.message },
      { status: 500 }
    );
  }
}
