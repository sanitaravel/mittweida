import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info, Plus, Minus, Navigation } from "lucide-react";
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
  skippedWaypoints?: Set<string>;
  routeWaypoints?: Place[];
}

const NavigationMap = ({
  route,
  userLocation,
  className = "",
  skippedWaypoints = new Set(),
  routeWaypoints,
}: NavigationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const markersRef = useRef<L.Marker[]>([]);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const userTrailRef = useRef<L.Polyline | null>(null);
  const previousSkippedSizeRef = useRef(0);
  const [showAttribution, setShowAttribution] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [routeData, setRouteData] = useState<{
    coordinates: [number, number][];
    distance: number;
    duration: number;
  } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [showDeviationWarning, setShowDeviationWarning] = useState(false);
  const [lastRouteUpdateLocation, setLastRouteUpdateLocation] = useState<[number, number] | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userPositionHistory, setUserPositionHistory] = useState<[number, number][]>([]);
  
  // Distance thresholds (in meters)
  const DEVIATION_THRESHOLD = 50; // 100 meters

  // Calculate distance between two coordinates in meters (Haversine formula)
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Check if user has deviated too much from the route
  const checkRouteDeviation = (userLocation: [number, number], routeCoordinates: [number, number][]): boolean => {
    if (!routeCoordinates.length) return false;
    
    // Find the closest point on the route to the user's location
    let minDistance = Infinity;
    
    for (const coord of routeCoordinates) {
      const distance = calculateDistance(userLocation, coord);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
    
    return minDistance > DEVIATION_THRESHOLD;
  };

  // Check if we should update the route based on user movement
  const shouldUpdateRoute = (currentLocation: [number, number]): boolean => {
    // Always update if this is the first time or no route data exists
    if (!routeData?.coordinates || !lastRouteUpdateLocation) return true;
    
    // Don't check deviation if we're currently loading a route
    if (isLoadingRoute) return false;
    
    // Check if user has deviated from the current route
    const hasDeviated = checkRouteDeviation(currentLocation, routeData.coordinates);
    
    // Also check if user has moved significantly from last update location
    const distanceFromLastUpdate = calculateDistance(currentLocation, lastRouteUpdateLocation);
    const hasMovedSignificantly = distanceFromLastUpdate > DEVIATION_THRESHOLD;

    // No need to update polyline here, SVG will render from context
    if (mapInstanceRef.current) {
      routeLayersRef.current.forEach(layer => {
        mapInstanceRef.current?.removeLayer(layer);
      });
      routeLayersRef.current = [];
    }
    
    return hasDeviated && hasMovedSignificantly;
  };

  // Clear only markers
  const clearMarkers = () => {
    if (mapInstanceRef.current) {
      markersRef.current.forEach(marker => {
        mapInstanceRef.current?.removeLayer(marker);
      });
      markersRef.current = [];
      
      if (userLocationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
        userLocationMarkerRef.current = null;
      }
    }
  };

  // Update user trail polyline
  const updateUserTrail = (newPositions: [number, number][]) => {
    if (!mapInstanceRef.current || newPositions.length < 2) return;

    const map = mapInstanceRef.current;

    // Remove existing trail if it exists
    if (userTrailRef.current) {
      map.removeLayer(userTrailRef.current);
      userTrailRef.current = null;
    }

    // Create new trail polyline
    const userTrail = L.polyline(newPositions, {
      color: '#ef4444', // Red color
      weight: 3,
      opacity: 0.8,
      smoothFactor: 1,
    }).addTo(map);

    userTrailRef.current = userTrail;
  };


  // Add route polylines to map
  const addRouteLines = (coordinates: [number, number][]) => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Create the main route polyline
    const routePolyline = L.polyline(coordinates, {
      color: getColorValue("blue"),
      weight: 4,
      opacity: 0.8,
      smoothFactor: 1,
    }).addTo(map);

    // Add animated dashed line on top
    const animatedLine = L.polyline(coordinates, {
      color: 'white',
      weight: 2,
      opacity: 0.9,
      dashArray: "10, 10",
      smoothFactor: 1,
    }).addTo(map);

    // Add animation to the polyline
    const pathElement = animatedLine.getElement() as SVGPathElement;
    if (pathElement) {
      pathElement.style.strokeDasharray = "10, 10";
      pathElement.style.animation = "dash 3s linear infinite";
    }

    // Store references for later cleanup
    routeLayersRef.current = [routePolyline, animatedLine];

    return routePolyline;
  };

  // Clear route polylines from map
  const clearRouteLines = () => {
    if (mapInstanceRef.current && routeLayersRef.current.length > 0) {
      routeLayersRef.current.forEach(layer => {
        mapInstanceRef.current?.removeLayer(layer);
      });
      routeLayersRef.current = [];
    }
  };

  // Add all markers to map
  const addMarkers = () => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const newMarkers: L.Marker[] = [];

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

      const marker = L.marker(place.coordinates, { icon: markerIcon }).addTo(map).bindPopup(`
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

      newMarkers.push(marker);
    });

    // Store references for later cleanup
    markersRef.current = newMarkers;
  };

  // Update or add user location marker
  const updateUserLocationMarker = () => {
    if (!mapInstanceRef.current || !userLocation) return;

    const map = mapInstanceRef.current;

    // Create user location icon
    const userIcon = L.divIcon({  
      html: `<div style="background: #ef4444; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative;">
               <div style="position: absolute; top: -2px; left: -2px; width: 20px; height: 20px; border: 2px solid #ef4444; border-radius: 50%; animation: pulse 2s infinite;"></div>
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

    if (userLocationMarkerRef.current) {
      // Update existing marker position
      userLocationMarkerRef.current.setLatLng(userLocation);
    } else {
      // Create new user location marker
      const userMarker = L.marker(userLocation, { icon: userIcon })
        .addTo(map)
        .bindPopup("<div><strong>Your Location</strong></div>");

      userLocationMarkerRef.current = userMarker;
    }
  };

  // Function to fetch actual routing data from OSRM
  const fetchRouteData = async (waypoints: [number, number][]) => {
    if (waypoints.length < 2) return null;
    
    setIsLoadingRoute(true);
    try {
      // Create coordinate string for OSRM API (longitude,latitude format)
      const coordinatesString = waypoints
        .map(([lat, lng]) => `${lng},${lat}`)
        .join(';');
      
      // Use OSRM demo server (you might want to use your own server in production)
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/foot/${coordinatesString}?overview=full&geometries=geojson&steps=true`
      );
      
      if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]);
        
        return {
          coordinates,
          distance: route.distance,
          duration: route.duration,
        };
      }
      
      return null;
    } catch (error) {
      console.error('[NavigationMap] Error fetching route data:', error);
      return null;
    } finally {
      setIsLoadingRoute(false);
    }
  };

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

  const handleCenterOnLocation = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView(userLocation);
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

    // Add event listeners to detect user interaction
    map.on('drag', () => setHasUserInteracted(true));
    map.on('zoom', () => setHasUserInteracted(true));
    map.on('click', () => setHasUserInteracted(true));

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        clearRouteLines();
        clearMarkers();
        
        // Clean up user trail
        if (userTrailRef.current) {
          mapInstanceRef.current.removeLayer(userTrailRef.current);
          userTrailRef.current = null;
        }
        
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [route]);

  // Clear route data when waypoints are skipped to force regeneration
  useEffect(() => {
    const currentSkippedSize = skippedWaypoints.size;
    const previousSkippedSize = previousSkippedSizeRef.current;
    
    if (currentSkippedSize > previousSkippedSize) {
      console.log("[NavigationMap] New waypoints skipped, clearing route for regeneration");
      setRouteData(null);
      setLastRouteUpdateLocation(null);
      clearRouteLines(); // Immediately clear the visual route
    }
    
    previousSkippedSizeRef.current = currentSkippedSize;
  }, [skippedWaypoints]);

  // Update route and markers
  useEffect(() => {
    if (!mapInstanceRef.current || !route.places.length) return;

    const map = mapInstanceRef.current;

    // Handle initial setup of markers (only once)
    if (markersRef.current.length === 0) {
      addMarkers();
    }

    // Handle user location marker updates
    if (userLocation) {
      // Update position history
      setUserPositionHistory(prevHistory => {
        const newHistory = [...prevHistory];
        
        // Only add if this is a new position (avoid duplicates)
        const lastPosition = newHistory[newHistory.length - 1];
        if (!lastPosition || 
            calculateDistance(userLocation, lastPosition) > 5) { // 5 meter threshold
          newHistory.push(userLocation);
          
          // Keep only last 1000 positions to avoid memory issues
          if (newHistory.length > 1000) {
            newHistory.shift();
          }
        }
        
        // Update user trail if we have at least 2 positions
        if (newHistory.length >= 2) {
          updateUserTrail(newHistory);
        }
        
        return newHistory;
      });
      
      updateUserLocationMarker();
    } else if (userLocationMarkerRef.current) {
      // Remove user location marker if user location is no longer available
      mapInstanceRef.current?.removeLayer(userLocationMarkerRef.current);
      userLocationMarkerRef.current = null;
    }

    // Handle route updates
    let waypoints: [number, number][] = [];
    let needsRouteUpdate = false;
    
    if (userLocation) {
      // Use routeWaypoints for route calculation if provided, else fallback to skipped logic
      const waypointsList: Place[] = routeWaypoints ?? route.places.filter((place: Place) => !skippedWaypoints.has(place.id));
      waypoints = [userLocation, ...waypointsList.map((place: Place) => place.coordinates)];
      needsRouteUpdate = shouldUpdateRoute(userLocation);
      
      if (needsRouteUpdate && !isLoadingRoute) {
        console.log("[NavigationMap] User has deviated from route, recalculating...");
        setShowDeviationWarning(true);
      } else if (!needsRouteUpdate) {
        console.log("[NavigationMap] User is on route, keeping existing path");
        setShowDeviationWarning(false);
      }
    } else {
      // Don't calculate route without user location - wait for user location to be available
      console.log("[NavigationMap] No user location available, waiting for location...");
      needsRouteUpdate = false;
    }

    // Only fetch new route if needed and not already loading
    if (needsRouteUpdate && !isLoadingRoute) {
      // Clear existing route lines but keep markers
      clearRouteLines();
      
      // Fetch and draw actual routing data
      const drawRoute = async () => {
        const routingData = await fetchRouteData(waypoints);
        
        if (routingData && routingData.coordinates.length > 0) {
          // Add new route lines
          const routePolyline = addRouteLines(routingData.coordinates);

          // Update state with route data
          setRouteData(routingData);
          if (userLocation) {
            setLastRouteUpdateLocation(userLocation);
          }
          setShowDeviationWarning(false); // Hide warning after successful update
          setIsInitialized(true);

          // Fit map to show route with proper padding (only on initial load)
          if (!hasUserInteracted && routePolyline) {
            if (userLocation) {
              // Include user location in bounds calculation
              const allCoordinates = [...routingData.coordinates, userLocation];
              const bounds = L.latLngBounds(allCoordinates);
              map.fitBounds(bounds, { padding: [30, 30] });
            } else {
              map.fitBounds(routePolyline.getBounds(), { padding: [30, 30] });
            }
          }

          console.log("[NavigationMap] Drew actual route path with", routingData.coordinates.length, "coordinates");
        } else {
          // Fallback to straight lines if routing fails
          console.log("[NavigationMap] Routing failed, falling back to straight lines");
          
          const fallbackPolyline = L.polyline(waypoints, {
            color: getColorValue("blue"),
            weight: 4,
            opacity: 0.8,
            dashArray: "10, 10", // Dashed to indicate this is not actual routing
          }).addTo(map);

          routeLayersRef.current = [fallbackPolyline];
          setIsInitialized(true);

          // Fit map to show route with proper padding (only on initial load)
          if (!hasUserInteracted) {
            if (userLocation) {
              const allCoordinates = [...waypoints, userLocation];
              const bounds = L.latLngBounds(allCoordinates);
              map.fitBounds(bounds, { padding: [30, 30] });
            } else {
              map.fitBounds(fallbackPolyline.getBounds(), { padding: [30, 30] });
            }
          }
        }
      };

      // Draw the route
      drawRoute();
    } else if (routeData && routeLayersRef.current.length === 0 && !isLoadingRoute) {
      // Use existing route data without recalculating, but only if route lines don't exist and not loading
      const routePolyline = addRouteLines(routeData.coordinates);

      // Fit map to show route with proper padding (only on initial load)
      if (!hasUserInteracted && routePolyline) {
        if (userLocation) {
          const allCoordinates = [...routeData.coordinates, userLocation];
          const bounds = L.latLngBounds(allCoordinates);
          map.fitBounds(bounds, { padding: [30, 30] });
        } else {
          map.fitBounds(routePolyline.getBounds(), { padding: [30, 30] });
        }
      }
    }
  }, [route, userLocation, hasUserInteracted, skippedWaypoints]);



  return (
    <div className={`h-full w-full relative ${className}`}>
      {/* Route Deviation Warning */}
      {showDeviationWarning && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-orange-100 border border-orange-400 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 text-sm text-orange-800">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="font-medium">You've deviated from the route - recalculating...</span>
          </div>
        </div>
      )}
      
      <style>
        {`
          .numbered-waypoint-marker .waypoint-number {
            background: var(--color-dustyBlue);
            color: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid white;
          }
          
          .numbered-waypoint-marker .start-marker {
            background: var(--color-sage);
          }
          
          .numbered-waypoint-marker .end-marker {
            background: var(--color-terracotta);
          }

          @keyframes dash {
            0% {
              stroke-dashoffset: 20;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          /* Global animation for any SVG path elements */
          .leaflet-zoom-animated path[style*="animation"] {
            animation: dash 3s linear infinite;
          }
        `}
      </style>
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

      {/* Center on Location Button */}
      {userLocation && (
        <button
          onClick={handleCenterOnLocation}
          className="absolute top-4 right-4 z-[1000] bg-white hover:bg-beige active:bg-gray-100 active:scale-95 p-3 rounded-xl shadow-lg transition-all duration-150"
          title="Center on My Location"
        >
          <Navigation size={24} className="text-charcoal" />
        </button>
      )}

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
