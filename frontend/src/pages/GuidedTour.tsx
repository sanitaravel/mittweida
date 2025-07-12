import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { mittweidaRoutes } from '../data/routes';
import NavigationMap from '../components/NavigationMap';
import { SkipForward } from 'lucide-react';

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
  description: string;
  places: Place[];
  color: string;
}

const GuidedTour = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const [, setLocation] = useLocation();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearbyWaypoint, setNearbyWaypoint] = useState<Place | null>(null);
  const [skippedWaypoints, setSkippedWaypoints] = useState<Set<string>>(new Set());
  
  // Distance thresholds (in meters)
  const WAYPOINT_PROXIMITY_THRESHOLD = 50; // 50 meters to show waypoint card

  // Find the current route
  const route = mittweidaRoutes.find(r => r.id === routeId) as Route | undefined;

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

  // Check if user is near any waypoint
  const checkWaypointProximity = (userLocation: [number, number]): { place: Place; index: number } | null => {
    if (!route) return null;
    
    for (let i = 0; i < route.places.length; i++) {
      const place = route.places[i];
      
      // Skip if this waypoint was already skipped
      if (skippedWaypoints.has(place.id)) continue;
      
      const distance = calculateDistance(userLocation, place.coordinates);
      
      if (distance <= WAYPOINT_PROXIMITY_THRESHOLD) {
        return { place, index: i };
      }
    }
    return null;
  };

  // Skip current waypoint and all previous waypoints
  const skipCurrentWaypoint = () => {
    if (!nearbyWaypoint || !route) return;
    
    // Find the index of the current waypoint
    const currentWaypointIndex = route.places.findIndex(place => place.id === nearbyWaypoint.id);
    
    if (currentWaypointIndex !== -1) {
      // Add current waypoint and all previous waypoints to skipped list
      const waypointsToSkip = route.places.slice(0, currentWaypointIndex + 1);
      setSkippedWaypoints(prev => {
        const newSkipped = new Set(prev);
        waypointsToSkip.forEach(waypoint => {
          newSkipped.add(waypoint.id);
        });
        return newSkipped;
      });
    }
    
    // Hide the waypoint card
    setNearbyWaypoint(null);
  };

  // Show story for current waypoint
  const showWaypointStory = () => {
    if (!nearbyWaypoint) return;
    
    // Navigate to story view
    setLocation(`/story/${nearbyWaypoint.id}`);
  };

  // Setup geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) return;
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Check for nearby waypoints when user location changes
  useEffect(() => {
    if (!userLocation || !route) return;

    const proximity = checkWaypointProximity(userLocation);
    if (proximity) {
      setNearbyWaypoint(proximity.place);
    } else {
      // Only clear if we're not currently showing a waypoint (to prevent flickering)
      if (nearbyWaypoint) {
        const currentDistance = calculateDistance(userLocation, nearbyWaypoint.coordinates);
        if (currentDistance > WAYPOINT_PROXIMITY_THRESHOLD * 1.5) { // Add some hysteresis
          setNearbyWaypoint(null);
        }
      }
    }
  }, [userLocation, route, nearbyWaypoint, WAYPOINT_PROXIMITY_THRESHOLD]);

  useEffect(() => {
    if (!route) {
      // Redirect to routes if route not found
      setLocation('/routes');
    }
  }, [route, setLocation]);

  if (!route) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">Route not found</h2>
          <p className="text-charcoal/70">Redirecting to route selection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      <NavigationMap
        route={route}
        userLocation={userLocation}
        className="h-full"
        skippedWaypoints={skippedWaypoints}
      />

      {/* Nearby Waypoint Card */}
      {nearbyWaypoint && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1001] bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs w-full mx-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{nearbyWaypoint.name}</h3>
              <button
                onClick={skipCurrentWaypoint}
                className="text-gray-500 hover:text-gray-700"
                title="Skip this waypoint"
              >
                <SkipForward size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-700">{nearbyWaypoint.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                {nearbyWaypoint.type}
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-3 py-1">
                ~{nearbyWaypoint.estimatedVisitTime} min
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={skipCurrentWaypoint}
                className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-300 transition-all duration-150"
              >
                Skip
              </button>
              <button
                onClick={showWaypointStory}
                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-md hover:bg-blue-700 transition-all duration-150"
              >
                View Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedTour;
