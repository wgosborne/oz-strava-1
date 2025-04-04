// /app/api/getActivities/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

// This function will handle the POST request to refresh the token
export async function GET(request: Request) { 
  try {
    const { access_token } = await request.json(); // Get the refresh token from the request body

    // Make the request to Strava to refresh the token
    const response = await axios.get(
        "https://www.strava.com/api/v3/athlete/activities",
        {
          params: {
            access_token: access_token,
          },
        }
    );
    console.log('route response', response)

    // Send the new access token back in the response
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh token: ' + {error} }, { status: 500 });
  }
}