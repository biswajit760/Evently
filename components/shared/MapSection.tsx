"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ExternalLink, Map as MapIcon } from 'lucide-react';
/**
 * 1. FIXING THE ICON ISSUE
 * In Next.js, the default Leaflet marker icons often break because of how 
 * images are bundled. We manually define where the icon images are located.
 */
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * 2. RECENTER COMPONENT
 * MapContainer props (like 'center') are only used when the map FIRST loads.
 * To move the map after it's already visible (like when the API returns data),
 * we need this helper component that uses the 'useMap' hook.
 */
function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 15); // Move the "camera" to the new coordinates
    }
  }, [coords, map]);
  return null;
}

export default function MapSection({ locationName }: { locationName: string }) {
  // We store the coordinates here as [Latitude, Longitude]
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        setLoading(true);
        setError(false);

        // 3. GEOCODING LOGIC
        // We call the Nominatim API with the location string.
        // encodeURIComponent ensures special characters in addresses don't break the URL.
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          // data[0] is the most relevant result
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCoords([lat, lon]);
        } else {
          setError(true); // No results found for that address
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (locationName) getCoordinates();
  }, [locationName]); // Re-run if the event location changes

  // 4. CONDITIONAL RENDERING
  // Show a loading skeleton while we wait for the API
  if (loading) {
    return <div className="h-[250px] w-full bg-gray-200 animate-pulse rounded-xl mt-4" />;
  }

  // Show a friendly message if the address couldn't be mapped
  if (error || !coords) {
    return (
      <div className="mt-4 p-4 border border-dashed rounded-xl text-center text-gray-500 text-sm">
        Map not available for this location.
      </div>
    );
  }

  return (
    // Inside your MapSection component return statement
<div className="group relative mt-4 h-[250px] w-full rounded-xl  overflow-hidden border-2 border-gray-100 shadow-inner">
  <MapContainer center={coords} zoom={5} className="h-full w-full z-0">
    <TileLayer 
  // CartoDB Positron is a beautiful, clean, light-colored map
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
/>
    <Marker position={coords} icon={icon} />
    <RecenterMap coords={coords} />
  </MapContainer>

  {/* Floating "Open in Google Maps" Button - Only shows on hover */}
  <div className="absolute bottom-3 right-3 z-[1000] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <a 
      href={`https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`}
      target="_blank"
      className="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-white transition-colors"
    >
      <ExternalLink className="w-3 h-3" />
      Directions
    </a>
  </div>
</div>
  );
}