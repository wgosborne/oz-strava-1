/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/api/refreshToken/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

// This function will handle the POST request to refresh the token
export async function POST(request: Request) { 
  try {
    //const { refreshToken } = await request.json(); // Get the refresh token from the request body

    // Make the request to Strava to refresh the token
    const response = await axios.post('https://www.strava.com/oauth/token', null, {
      params: {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: process.env.STRAVA_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      },
    });

    // Send the new access token back in the response
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh token: ' + {error} }, { status: 500 });
  }
}
