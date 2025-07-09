import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

const NavigationMap = ({ route, userLocation, className = '' }: NavigationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: route.places[0]?.coordinates || [50.9867, 12.9792],
      zoom: 15,
      zoomControl: true,
      attributionControl: true,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

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

    // Create route polyline
    const routeCoordinates = route.places.map(place => place.coordinates);
    const polyline = L.polyline(routeCoordinates, {
      color: '#3B82F6',
      weight: 4,
      opacity: 0.8,
    }).addTo(map);

    // Add markers for each place
    route.places.forEach((place, index) => {
      L.marker(place.coordinates)
        .addTo(map)
        .bindPopup(`
          <div>
            <h3><strong>${place.name}</strong></h3>
            <p>${place.description}</p>
            <p><em>Stop ${index + 1}</em></p>
          </div>
        `);
    });

    // Add user location marker if available
    if (userLocation) {
      L.marker(userLocation)
        .addTo(map)
        .bindPopup('<div><strong>Your Location</strong></div>');
    }

    // Fit map to show route
    if (routeCoordinates.length > 0) {
      map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
    }
  }, [route, userLocation]);

  return <div ref={mapRef} className={`w-full h-full ${className}`} />;
};

export default NavigationMap;
