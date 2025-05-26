export interface Activity {
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
    visibility: string | null;
    location_city: string | null;
    location_state: string | null;
    location_country: string | null;
    summary_polyline: string | null;
    start_lat: number | null;
    start_lng: number | null;
    end_lat: number | null;
    end_lng: number | null;
    raw_json?: string | null;
    athlete: {
      id: number;
    };
    map: {
      summary_polyline: string;
    };
  }
  