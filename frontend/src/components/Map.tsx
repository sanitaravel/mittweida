import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Info } from "lucide-react";
import { useState } from "react";
import L from "leaflet";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  className?: string;
}

// Mitweida coordinates
const MITWEIDA_CENTER: [number, number] = [50.9842, 12.9784];

const Map: React.FC<MapProps> = ({ className = "" }) => {
  const [showAttribution, setShowAttribution] = useState(false);

  return (
    <div className={`h-full w-full relative ${className}`}>
      <MapContainer
        center={MITWEIDA_CENTER}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
        attributionControl={false}
      >
        <TileLayer
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          detectRetina={true}
          subdomains="abcd"
        />
        <Marker position={MITWEIDA_CENTER}>
          <Popup>
            Mitweida City Center
          </Popup>
        </Marker>
      </MapContainer>
      
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
          <div className="mb-1">Map tiles by CartoDB</div>
          <div className="mb-1">Powered by <a href="https://leafletjs.com/" className="text-blue-600 hover:underline">Leaflet</a></div>
          <div>© <a href="https://www.openstreetmap.org/copyright" className="text-blue-600 hover:underline">OpenStreetMap</a> contributors</div>
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
