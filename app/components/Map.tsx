import React from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLng } from "leaflet";

interface Props {
  zoom: number;
  activities: [];
}

const Map = ({ zoom, activities }: Props) => {
  const position = new LatLng(35.16, -90.05);
  //const position = new LatLng(lat, lng);

  const mapStyle = { height: "750px", width: "100%" };

  const getCoordinatesForActivity = (activity: any) => {
    if (activity.map && activity.map.summary_polyline) {
      // Decode polyline (Strava format)
      const polyline = decodePolyline(activity.map.summary_polyline);

      return polyline;
    }
    return []; // Empty array if no coordinates available
  };

  // Function to decode polyline from Strava format
  const decodePolyline = (encoded: string) => {
    let index = 0;
    const decoded: [number, number][] = [];
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;
      let byte;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const dLat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dLat;

      shift = 0;
      result = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const dLng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dLng;

      decoded.push([lat / 1e5, lng / 1e5]); // Convert to decimal degrees
    }

    return decoded;
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      style={mapStyle}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {activities.map((activity) => {
        const coordinates = getCoordinatesForActivity(activity); // Get coordinates for the polyline

        return coordinates.length > 0 ? (
          <Polyline
            key={activity.id}
            positions={coordinates}
            color="blue" // Customize line color
            weight={4} // Customize line weight
            opacity={0.4} // Customize line opacity
          />
        ) : null;
      })}

      {activities.map((activity) => (
        <Marker
          key={activity.id}
          position={[activity.start_latlng[0], activity.start_latlng[1]]}
        >
          <Popup>
            {activity.name} <br />
            {activity.distance} meters
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
