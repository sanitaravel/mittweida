import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info, Plus, Minus } from "lucide-react";
import { routeCache } from "../utils/routeCache";
import { getColorValue } from "../utils/routeUtils";

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Place {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: string;
  estimatedVisitTime: number;
}

interface Route {
  id: string;
  name: string;
  places: Place[];
  color: string;
}

interface NavigationMapProps {
  route: Route;
  userLocation?: [number, number] | null;
  className?: string;
}

const NavigationMap = ({
  route,
  userLocation,
  className = "",
}: NavigationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [showAttribution, setShowAttribution] = useState(false);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: route.places[0]?.coordinates || [50.9867, 12.9792],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Add tile layer
    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png",
      {
        attribution: "",
        maxZoom: 20,
        detectRetina: true,
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [route]);

  // Update route and markers
  useEffect(() => {
    if (!mapInstanceRef.current || !route.places.length) return;

    const map = mapInstanceRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Try to get cached route data for actual routing path
    const cachedRouteData = routeCache.get(route.id);
    let routeCoordinates: [number, number][] = [];
    let polyline: L.Polyline;

    if (cachedRouteData && cachedRouteData.coordinates) {
      console.log("[NavigationMap] Using cached route data:", {
        routeId: route.id,
        coordinateCount: cachedRouteData.coordinates.length,
        totalDistance: cachedRouteData.summary?.totalDistance,
        totalTime: cachedRouteData.summary?.totalTime,
      });

      // Use the actual route coordinates from the cached data
      routeCoordinates = cachedRouteData.coordinates.map((coord: any) => [
        coord.lat,
        coord.lng,
      ]);

      // Create a detailed polyline from the actual route
      polyline = L.polyline(routeCoordinates, {
        color: getColorValue("blue"),
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
      }).addTo(map);

      console.log(
        "[NavigationMap] Drew actual route path with",
        routeCoordinates.length,
        "coordinates"
      );
    } else {
      console.log(
        "[NavigationMap] No cached route data found, falling back to direct connections"
      );

      // Fall back to simple polyline between places
      routeCoordinates = route.places.map((place) => place.coordinates);
      polyline = L.polyline(routeCoordinates, {
        color: getColorValue("blue"),
        weight: 4,
        opacity: 0.8,
        dashArray: "10, 10", // Dashed line to indicate this is not the actual route
      }).addTo(map);
    }

    // Add markers for each place
    route.places.forEach((place, index) => {
      const isStart = index === 0;
      const isEnd = index === route.places.length - 1;

      // Create custom icons for start and end points
      let markerIcon;
      if (isStart) {
        markerIcon = L.divIcon({
          className: "numbered-waypoint-marker",
          html: `<div class="waypoint-number start-marker">${index + 1}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
      } else if (isEnd) {
        markerIcon = L.divIcon({
          className: "numbered-waypoint-marker",
          html: `<div class="waypoint-number end-marker">${index + 1}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
      } else {
        markerIcon = L.divIcon({
          className: "numbered-waypoint-marker",
          html: `<div class="waypoint-number">${index + 1}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
      }

      L.marker(place.coordinates, { icon: markerIcon }).addTo(map).bindPopup(`
          <div style="max-width: 200px;">
            <h3><strong>${place.name}</strong></h3>
            <p style="margin: 8px 0;">${place.description}</p>
            <p style="margin: 4px 0;"><em>Stop ${index + 1} ${
        isStart ? "(Start)" : isEnd ? "(End)" : ""
      }</em></p>
            <p style="margin: 4px 0; font-size: 0.9em; color: #666;">Estimated visit: ${
              place.estimatedVisitTime
            } minutes</p>
          </div>
        `);

      // Add dashed line from attraction to nearest point on route path (only if we have cached route data)
      if (cachedRouteData && cachedRouteData.coordinates && routeCoordinates.length > 1) {
        // Find the closest point on the actual route path to this attraction
        let closestPoint = routeCoordinates[0];
        let minDistance = Infinity;

        routeCoordinates.forEach((coord) => {
          const distance = Math.sqrt(
            Math.pow(coord[0] - place.coordinates[0], 2) + 
            Math.pow(coord[1] - place.coordinates[1], 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = coord;
          }
        });

        // Only draw the dashed line if the attraction is not already on the route path
        // (i.e., if the closest point is more than a small threshold away)
        const threshold = 0.0001; // Small distance threshold
        if (minDistance > threshold) {
          L.polyline([place.coordinates, closestPoint], {
            color: '#64748B',
            weight: 3,
            opacity: 0.6,
            dashArray: '8, 6',
          }).addTo(map);
        }
      }
    });

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `<div style="background: var(--color-warmGray); border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative;">
                 <div style="position: absolute; top: -2px; left: -2px; width: 20px; height: 20px; border: 2px solid var(--color-warmGray); border-radius: 50%; animation: pulse 2s infinite;"></div>
               </div>
               <style>
                 @keyframes pulse {
                   0% { transform: scale(1); opacity: 1; }
                   100% { transform: scale(2); opacity: 0; }
                 }
               </style>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        className: "user-location-marker",
      });

      L.marker(userLocation, { icon: userIcon })
        .addTo(map)
        .bindPopup("<div><strong>Your Location</strong></div>");
    }

    // Fit map to show route with proper padding
    if (routeCoordinates.length > 0) {
      if (userLocation) {
        // Include user location in bounds calculation
        const allCoordinates = [...routeCoordinates, userLocation];
        const bounds = L.latLngBounds(allCoordinates);
        map.fitBounds(bounds, { padding: [30, 30] });
      } else {
        map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
      }
    }

    // Add route info popup if cached data is available
    if (cachedRouteData && cachedRouteData.summary) {
    }
  }, [route, userLocation]);

  return (
    <div className={`h-full w-full relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Custom Zoom Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white hover:bg-beige active:bg-gray-100 active:scale-95 p-3 rounded-xl shadow-lg transition-all duration-150"
          title="Zoom In"
        >
          <Plus size={24} className="text-charcoal" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white hover:bg-beige active:bg-gray-100 active:scale-95 p-3 rounded-xl shadow-lg transition-all duration-150"
          title="Zoom Out"
        >
          <Minus size={24} className="text-charcoal" />
        </button>
      </div>

      {/* Attribution Info Button */}
      <button
        onClick={() => setShowAttribution(!showAttribution)}
        className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-[1000]"
        title="Map Information"
      >
        <Info size={16} className="text-charcoal" />
      </button>

      {/* Attribution Popup */}
      {showAttribution && (
        <div className="absolute bottom-12 right-2 bg-white p-3 rounded-lg shadow-lg text-xs text-charcoal max-w-xs z-[1000]">
          <div className="mb-1">
            © Stadia Maps, © Stamen Design, © OpenStreetMap contributors
          </div>
          <div className="mb-1">
            Route data © OpenStreetMap contributors under{" "}
            <a
              href="http://opendatacommons.org/licenses/odbl/"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ODbL
            </a>
          </div>
          <div className="mb-1">
            Routing by{" "}
            <a
              href="http://project-osrm.org/"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OSRM
            </a>
          </div>
          <div className="mb-1">
            Powered by{" "}
            <a
              href="https://leafletjs.com/"
              className="text-blue-600 hover:underline"
            >
              Leaflet
            </a>
          </div>
          <button
            onClick={() => setShowAttribution(false)}
            className="mt-2 text-xs text-charcoal/60 hover:text-charcoal"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NavigationMap;
