import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { mittweidaRoutes } from "../data/routes";
import { useTourContext } from "../contexts/TourContext";
import NavigationMap from "../components/NavigationMap";
import { SkipForward, MapPin, Navigation } from "lucide-react";

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
  const { setRouteId, addVisitedWaypoint, visitedWaypoints } = useTourContext();
  const [, setLocation] = useLocation();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [nearbyWaypoint, setNearbyWaypoint] = useState<Place | null>(null);
  const [skippedWaypoints, setSkippedWaypoints] = useState<Set<string>>(
    new Set()
  );
  const [geolocationStatus, setGeolocationStatus] = useState<
    "pending" | "granted" | "denied" | "unavailable"
  >("pending");
  const [showLocationButton, setShowLocationButton] = useState(false);

  // Distance thresholds (in meters)
  const WAYPOINT_PROXIMITY_THRESHOLD = 50; // 50 meters to show waypoint card

  // Find the current route
  const route = mittweidaRoutes.find((r) => r.id === routeId) as
    | Route
    | undefined;
  // Set routeId in context on mount
  useEffect(() => {
    setRouteId(routeId || null);
  }, [routeId, setRouteId]);

  // Request geolocation permission (user-initiated)
  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeolocationStatus("unavailable");
      setShowLocationButton(false);
      return;
    }

    // Use getCurrentPosition to trigger the browser's native permission dialog
    // This must be called from a user interaction to work reliably
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Permission granted and location received
        setGeolocationStatus("granted");
        setShowLocationButton(false);
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Geolocation permission denied:", error);
        setGeolocationStatus("denied");
        setShowLocationButton(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Calculate distance between two coordinates in meters (Haversine formula)
  const calculateDistance = (
    coord1: [number, number],
    coord2: [number, number]
  ): number => {
    // Haversine formula
    const toRad = (value: number) => (value * Math.PI) / 180;
    const lat1 = coord1[0];
    const lon1 = coord1[1];
    const lat2 = coord2[0];
    const lon2 = coord2[1];
    const R = 6371000; // Earth's radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  // Show waypoint card only for the current waypoint (next unvisited and unskipped)
  useEffect(() => {
    if (!route) return;

    // Find the current waypoint: first not visited and not skipped
    const currentWaypoint = route.places.find(
      (place) =>
        !visitedWaypoints.includes(place.id) && !skippedWaypoints.has(place.id)
    );

    // If geolocation is granted, check proximity
    if (geolocationStatus === "granted" && userLocation && currentWaypoint) {
      const distance = calculateDistance(
        userLocation,
        currentWaypoint.coordinates
      );
      if (distance <= WAYPOINT_PROXIMITY_THRESHOLD) {
        setNearbyWaypoint(currentWaypoint);
      } else {
        setNearbyWaypoint(null);
      }
    } else if (
      (geolocationStatus === "denied" || geolocationStatus === "unavailable") &&
      currentWaypoint
    ) {
      // If geolocation denied/unavailable, always show the current waypoint card
      setNearbyWaypoint(currentWaypoint);
    } else {
      setNearbyWaypoint(null);
    }
  }, [
    userLocation,
    route,
    visitedWaypoints,
    skippedWaypoints,
    geolocationStatus,
    WAYPOINT_PROXIMITY_THRESHOLD,
  ]);
  const skipCurrentWaypoint = () => {
    if (!nearbyWaypoint || !route) return;

    // Find the index of the current waypoint
    const currentWaypointIndex = route.places.findIndex(
      (place) => place.id === nearbyWaypoint.id
    );

    if (currentWaypointIndex !== -1) {
      // Add current waypoint and all previous waypoints to skipped list
      const waypointsToSkip = route.places.slice(0, currentWaypointIndex + 1);
      setSkippedWaypoints((prev) => {
        const newSkipped = new Set(prev);
        waypointsToSkip.forEach((waypoint) => {
          newSkipped.add(waypoint.id);
          addVisitedWaypoint(waypoint.id);
        });
        return newSkipped;
      });
    }

    // If geolocation is not available, automatically show next waypoint
    if (geolocationStatus === "denied" || geolocationStatus === "unavailable") {
      const nextWaypoint = route.places.find(
        (place, index) =>
          index > currentWaypointIndex && !skippedWaypoints.has(place.id)
      );
      setNearbyWaypoint(nextWaypoint || null);
    } else {
      // Hide the waypoint card for geolocation mode
      setNearbyWaypoint(null);
    }
  };

  // Show story for current waypoint
  const showWaypointStory = () => {
    if (!nearbyWaypoint) return;

    // Update to next waypoint before redirecting
    const currentWaypointIndex =
      route?.places.findIndex((place) => place.id === nearbyWaypoint.id) ?? -1;
    if (currentWaypointIndex !== -1) {
      const nextWaypoint = route?.places.find(
        (place, index) =>
          index > currentWaypointIndex &&
          !skippedWaypoints.has(place.id) &&
          !visitedWaypoints.includes(place.id)
      );
      setNearbyWaypoint(nextWaypoint || null);
    }

    addVisitedWaypoint(nearbyWaypoint.id);
    setLocation(`/story/${routeId}/${nearbyWaypoint.id}`);
  };

  // Setup geolocation on component mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocationStatus("unavailable");
      return;
    }

    // Check existing permission status
    const checkExistingPermission = async () => {
      try {
        if ("permissions" in navigator) {
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });
          if (permission.state === "granted") {
            setGeolocationStatus("granted");
            return;
          }
        }

        // For denied, prompt, or when permissions API not available,
        // show a button to request permission (requires user interaction)
        setShowLocationButton(true);
      } catch (error) {
        // If permissions API fails, show button to request permission
        setShowLocationButton(true);
      }
    };

    checkExistingPermission();
  }, []);

  // Setup geolocation tracking when permission is granted
  useEffect(() => {
    let watchId: number;

    if (geolocationStatus === "granted") {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [geolocationStatus]);

  // ...existing code...

  useEffect(() => {
    if (!route) {
      // Redirect to routes if route not found
      setLocation("/routes");
    }
  }, [route, setLocation]);

  if (!route) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">
            Route not found
          </h2>
          <p className="text-charcoal/70">Redirecting to route selection...</p>
        </div>
      </div>
    );
  }

  // Prepare filtered waypoints for route calculation (exclude visited)
  const routeWaypoints = route
    ? route.places.filter((place) => !visitedWaypoints.includes(place.id))
    : [];

  // Check if all waypoints are visited or skipped
  const allWaypointsPassed =
    route &&
    route.places.every(
      (place) =>
        visitedWaypoints.includes(place.id) || skippedWaypoints.has(place.id)
    );

  return (
    <div className="h-screen w-full relative">
      {route && (
        <NavigationMap
          route={route}
          userLocation={userLocation}
          className="h-full"
          skippedWaypoints={skippedWaypoints}
          routeWaypoints={routeWaypoints}
        />
      )}

      {/* Enable Location Button */}
      {showLocationButton && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1002]">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Navigation className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">
                Enable Location
              </h3>
            </div>
            <p className="text-gray-700 mb-4 text-sm">
              Get personalized navigation and see nearby waypoints by enabling
              location access.
            </p>
            <button
              onClick={requestGeolocation}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-all duration-150 flex items-center justify-center gap-2"
            >
              <Navigation size={18} />
              Enable Location Access
            </button>
            <button
              onClick={() => {
                setGeolocationStatus("denied");
                setShowLocationButton(false);
              }}
              className="w-full mt-2 text-gray-600 text-sm hover:text-gray-800 transition-colors"
            >
              Continue without location
            </button>
          </div>
        </div>
      )}

      {/* Location Status Indicator */}
      {(geolocationStatus === "denied" ||
        geolocationStatus === "unavailable") && (
        <div className="absolute top-4 left-4 right-4 z-[1001] bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <MapPin className="text-amber-600" size={16} />
            <p className="text-sm text-amber-800">
              {geolocationStatus === "unavailable"
                ? "Location services unavailable. Showing all waypoints in order."
                : "Location access denied. Showing all waypoints in order."}
            </p>
          </div>
        </div>
      )}

      {/* Nearby Waypoint Card */}
      {nearbyWaypoint && !visitedWaypoints.includes(nearbyWaypoint.id) && (
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
            <p className="text-sm text-gray-700">
              {nearbyWaypoint.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                {nearbyWaypoint.type}
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-3 py-1">
                ~{nearbyWaypoint.estimatedVisitTime} min
              </span>
            </div>
            {geolocationStatus === "granted" && userLocation && (
              <div className="text-xs text-gray-600">
                Distance:{" "}
                {Math.round(
                  calculateDistance(userLocation, nearbyWaypoint.coordinates)
                )}
                m
              </div>
            )}
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

      {/* Completion Card */}
      {allWaypointsPassed && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1003] bg-beige border-4 border-sage rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center">
          <h3 className="text-3xl font-bold text-sage mb-3">
            Congratulations!
          </h3>
          <p className="text-charcoal mb-6 text-center text-lg font-medium">
            You've completed all waypoints on this route.
          </p>
          <button
            className="bg-sage text-white rounded-xl px-8 py-4 font-semibold text-xl shadow-lg hover:bg-terracotta transition-all duration-150"
            onClick={() => setLocation(`/completion/${routeId}`)}
          >
            Finish Route
          </button>
        </div>
      )}
    </div>
  );
};

export default GuidedTour;
