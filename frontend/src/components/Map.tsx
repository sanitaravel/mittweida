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
}

// Mitweida coordinates
const MITWEIDA_CENTER: [number, number] = [50.9842, 12.9784];

const Map: React.FC<MapProps> = ({ className = "" }) => {
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
    onMapReady,
  }: {
    onMapReady: (map: L.Map) => void;
  }) => {
    const map = useMapEvents({
      zoomend: () => {
        // Optional: handle zoom end events
      },
    });

    useEffect(() => {
      onMapReady(map);
    }, [map, onMapReady]);

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
          onMapReady={(map) => {
            mapRef.current = map;
          }}
        />
        <TileLayer
          attribution=""
          url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
          maxZoom={18}
          detectRetina={true}
        />
        <Marker position={MITWEIDA_CENTER}>
          <Popup>Mitweida City Center</Popup>
        </Marker>
      </MapContainer>{" "}
      {/* Custom Zoom Controls */}
      <div className="absolute top-4 right-20 z-[1000] flex gap-2">
        <button
          onClick={handleZoomOut}
          className="bg-white hover:bg-beige active:bg-gray-100 active:scale-95 p-3 rounded-xl shadow-lg transition-all duration-150"
          title="Zoom Out"
        >
          <Minus size={24} className="text-charcoal" />
        </button>
        <button
          onClick={handleZoomIn}
          className="bg-white hover:bg-beige active:bg-gray-100 active:scale-95 p-3 rounded-xl shadow-lg transition-all duration-150"
          title="Zoom In"
        >
          <Plus size={24} className="text-charcoal" />
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
