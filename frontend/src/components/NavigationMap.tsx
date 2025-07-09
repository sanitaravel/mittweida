import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routeCache } from '../utils/routeCache';

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

    // Try to get cached route data for actual routing path
    const cachedRouteData = routeCache.get(route.id);
    let routeCoordinates: [number, number][] = [];
    let polyline: L.Polyline;

    if (cachedRouteData && cachedRouteData.coordinates) {
      console.log('[NavigationMap] Using cached route data:', {
        routeId: route.id,
        coordinateCount: cachedRouteData.coordinates.length,
        totalDistance: cachedRouteData.summary?.totalDistance,
        totalTime: cachedRouteData.summary?.totalTime
      });

      // Use the actual route coordinates from the cached data
      routeCoordinates = cachedRouteData.coordinates.map((coord: any) => [coord.lat, coord.lng]);
      
      // Create a detailed polyline from the actual route
      polyline = L.polyline(routeCoordinates, {
        color: route.color || '#3B82F6',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(map);

      console.log('[NavigationMap] Drew actual route path with', routeCoordinates.length, 'coordinates');
    } else {
      console.log('[NavigationMap] No cached route data found, falling back to direct connections');
      
      // Fall back to simple polyline between places
      routeCoordinates = route.places.map(place => place.coordinates);
      polyline = L.polyline(routeCoordinates, {
        color: route.color || '#3B82F6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10' // Dashed line to indicate this is not the actual route
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
          html: `<div style="background: #10B981; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${index + 1}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          className: 'custom-marker'
        });
      } else if (isEnd) {
        markerIcon = L.divIcon({
          html: `<div style="background: #EF4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${index + 1}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          className: 'custom-marker'
        });
      } else {
        markerIcon = L.divIcon({
          html: `<div style="background: #3B82F6; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${index + 1}</div>`,
          iconSize: [25, 25],
          iconAnchor: [12.5, 12.5],
          className: 'custom-marker'
        });
      }

      L.marker(place.coordinates, { icon: markerIcon })
        .addTo(map)
        .bindPopup(`
          <div style="max-width: 200px;">
            <h3><strong>${place.name}</strong></h3>
            <p style="margin: 8px 0;">${place.description}</p>
            <p style="margin: 4px 0;"><em>Stop ${index + 1} ${isStart ? '(Start)' : isEnd ? '(End)' : ''}</em></p>
            <p style="margin: 4px 0; font-size: 0.9em; color: #666;">Estimated visit: ${place.estimatedVisitTime} minutes</p>
          </div>
        `);
    });

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `<div style="background: #8B5CF6; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative;">
                 <div style="position: absolute; top: -2px; left: -2px; width: 20px; height: 20px; border: 2px solid #8B5CF6; border-radius: 50%; animation: pulse 2s infinite;"></div>
               </div>
               <style>
                 @keyframes pulse {
                   0% { transform: scale(1); opacity: 1; }
                   100% { transform: scale(2); opacity: 0; }
                 }
               </style>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        className: 'user-location-marker'
      });

      L.marker(userLocation, { icon: userIcon })
        .addTo(map)
        .bindPopup('<div><strong>Your Location</strong></div>');
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

  return <div ref={mapRef} className={`w-full h-full ${className}`} />;
};

export default NavigationMap;
