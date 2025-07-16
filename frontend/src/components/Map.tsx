import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Info, Plus, Minus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import L from "leaflet";
import type { Route } from "./RouteCard";
import RoutingMachine from "./RoutingMachine";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  className?: string;
  routes?: Route[];
  selectedRouteId?: string | null;
  onRouteSelect?: (routeId: string) => void;
  showRoutePaths?: boolean;
  showWaypoints?: boolean;
  markerRoutes?: Route[]; // Separate routes for markers (for pagination)
  refreshKey?: string; // Key to force re-render when pagination/filters change
}

// Mitweida coordinates
const MITWEIDA_CENTER: [number, number] = [50.9842, 12.9784];

const Map: React.FC<MapProps> = ({
  className = "",
  routes = [],
  // selectedRouteId, // For future use to highlight selected route
  onRouteSelect,
  showRoutePaths = false,
  showWaypoints = true,
  markerRoutes, // If provided, use these routes for markers instead of main routes
  refreshKey = "", // Key to force re-render
}) => {
  const [showAttribution, setShowAttribution] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  // Custom hook to get map instance
  const MapController = ({
    onMapInstanceReady,
  }: {
    onMapInstanceReady: (map: L.Map) => void;
  }) => {
    const map = useMapEvents({
      zoomend: () => {
        // Optional: handle zoom end events
      },
    });

    useEffect(() => {
      onMapInstanceReady(map);
    }, [map, onMapInstanceReady]);

    return null;
  };

  return (
    <div className={`h-full w-full relative ${className}`}>
      {" "}
      <MapContainer
        center={MITWEIDA_CENTER}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
        attributionControl={false}
        zoomControl={false}
      >
        <MapController
          onMapInstanceReady={(map) => {
            mapRef.current = map;
          }}
        />{" "}
        <TileLayer
          attribution=""
          url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
          maxZoom={20}
          detectRetina={true}
        />
        {/* Routing Machine Components */}
        {showRoutePaths &&
          routes.map((route, index) => {
            if (route.places.length < 2) return null;

            // Create waypoints for all places in the route
            const waypoints = route.places.map((place) =>
              L.latLng(place.coordinates[0], place.coordinates[1])
            );

            console.log("[Map] Creating RoutingMachine for route:", {
              routeId: route.id,
              routeName: route.name,
              placesCount: route.places.length,
              waypointCount: waypoints.length,
              color: route.color,
              delay: index * 200,
              refreshKey,
              places: route.places.map((p) => ({
                name: p.name,
                coordinates: p.coordinates,
              })),
              waypoints: waypoints.map((wp) => ({
                lat: wp.lat,
                lng: wp.lng,
                isLatLng: wp instanceof L.LatLng,
                type: typeof wp,
              })),
            });

            return (
              <RoutingMachine
                key={`route-${route.id}-${refreshKey}`}
                routeId={route.id}
                waypoints={waypoints}
                color={route.color}
                routeWhileDragging={false}
                addWaypoints={false}
                show={false}
                showWaypoints={showWaypoints}
                delay={index * 200} // Stagger requests by 200ms to respect API limits
              />
            );
          })}
        {/* Route Start Point Markers */}
        {(markerRoutes || routes).map((route) => {
          // Use first place as start point for marker
          if (route.places.length === 0) return null;
          const startPoint = route.places[0].coordinates;

          return (
            <Marker
              key={route.id}
              position={startPoint}
              eventHandlers={{
                click: () => {
                  if (onRouteSelect) {
                    onRouteSelect(route.id);
                  }
                },
              }}
            >
            </Marker>
          );
        })}
      </MapContainer>
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

export default Map;
