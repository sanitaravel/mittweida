import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  return (
    <div className={`h-full w-full ${className}`}>
      <MapContainer
        center={MITWEIDA_CENTER}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
    </div>
  );
};

export default Map;
