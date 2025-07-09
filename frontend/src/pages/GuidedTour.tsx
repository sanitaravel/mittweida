import { useParams, Link } from "wouter";
import {
  Play,
  Image,
  Pause,
  SkipForward,
  Navigation,
  Compass,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useState, useEffect } from "react";
import Map from "../components/Map";
import { mittweidaRoutes } from "../data/routes";
import type { Route } from "../components/RouteCard";

interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading?: number;
}

interface NavigationState {
  userLocation: LocationCoords | null;
  orientationMode: 'look-north' | 'follow-direction';
  isNavigating: boolean;
  nearbyWaypoints: string[];
}

const GuidedTour = () => {
  const { t } = useTranslation();
  const { routeId } = useParams<{ routeId: string }>();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    userLocation: null,
    orientationMode: 'follow-direction',
    isNavigating: false,
    nearbyWaypoints: [],
  });
  const [watchId, setWatchId] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  // Find the current route
  useEffect(() => {
    const route = mittweidaRoutes.find(r => r.id === routeId);
    setCurrentRoute(route || null);
  }, [routeId]);

  // Request location permissions and start tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    const startLocationTracking = () => {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const coords: LocationCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading || undefined,
          };
          
          setNavigationState(prev => ({
            ...prev,
            userLocation: coords,
            isNavigating: true,
          }));
          setLocationError('');
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        }
      );
      setWatchId(id);
    };

    startLocationTracking();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Check for nearby waypoints
  useEffect(() => {
    if (!navigationState.userLocation || !currentRoute) return;

    const nearbyWaypoints = currentRoute.places.filter(place => {
      const distance = calculateDistance(
        navigationState.userLocation!.latitude,
        navigationState.userLocation!.longitude,
        place.coordinates[0],
        place.coordinates[1]
      );
      return distance < 50; // Within 50 meters
    }).map(place => place.id);

    setNavigationState(prev => ({
      ...prev,
      nearbyWaypoints,
    }));
  }, [navigationState.userLocation, currentRoute]);

  const toggleOrientationMode = () => {
    setNavigationState(prev => ({
      ...prev,
      orientationMode: prev.orientationMode === 'look-north' ? 'follow-direction' : 'look-north',
    }));
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    return (θ * 180 / Math.PI + 360) % 360;
  };

  const getDirectionToNextStop = (): { distance: number; bearing: number; direction: string } | null => {
    if (!navigationState.userLocation || !currentRoute || currentStopIndex >= currentRoute.places.length) {
      return null;
    }

    const nextStop = currentRoute.places[currentStopIndex];
    const distance = calculateDistance(
      navigationState.userLocation.latitude,
      navigationState.userLocation.longitude,
      nextStop.coordinates[0],
      nextStop.coordinates[1]
    );

    const bearing = calculateBearing(
      navigationState.userLocation.latitude,
      navigationState.userLocation.longitude,
      nextStop.coordinates[0],
      nextStop.coordinates[1]
    );

    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const direction = directions[Math.round(bearing / 45) % 8];

    return { distance, bearing, direction };
  };

  const currentStop = currentRoute?.places[currentStopIndex];
  const navigationInfo = getDirectionToNextStop();

  if (!currentRoute) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle size={48} className="text-terracotta mx-auto mb-4" />
          <h2 className="text-xl font-bold text-charcoal mb-2">Route not found</h2>
          <p className="text-charcoal/70">The requested route could not be loaded.</p>
          <Link href="/routes">
            <button className="btn-primary mt-4">Back to Routes</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Map Area */}
      <div className="h-3/5 relative">
        <Map
          className="h-full w-full"
          routes={[currentRoute]}
          showRoutePaths={true}
          showWaypoints={true}
          userLocation={navigationState.userLocation}
          showUserLocation={true}
        />
        
        {/* Navigation Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-charcoal">
                {navigationState.userLocation ? t('locationFound') : t('findingLocation')}
              </span>
            </div>
          </div>
          
          <button 
            onClick={toggleOrientationMode}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white transition-colors"
          >
            <Compass size={24} className="text-charcoal" />
          </button>
        </div>

        {/* Location Error */}
        {locationError && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-red-100 border border-red-300 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 text-sm font-medium">{t('locationError')}</p>
                  <p className="text-red-700 text-sm">{locationError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Direction Indicator */}
        {navigationInfo && navigationState.userLocation && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Navigation size={20} className="text-dustyBlue" />
                  <span className="text-sm font-medium text-charcoal">
                    {Math.round(navigationInfo.distance)}m {navigationInfo.direction}
                  </span>
                </div>
                <div className="text-xs text-charcoal/70">to {currentStop?.name}</div>
              </div>
            </div>
          </div>
        )}

        {/* Nearby Waypoint Alert */}
        {navigationState.nearbyWaypoints.length > 0 && (
          <div className="absolute top-20 left-4 right-4">
            <div className="bg-sage/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <MapPin size={24} className="text-white" />
                <div className="flex-1">
                  <p className="text-white font-medium">{t('waypointNearby')}</p>
                  <p className="text-white/90 text-sm">{t('closeToPointOfInterest')}</p>
                </div>
                <Link href={`/story/${navigationState.nearbyWaypoints[0]}`}>
                  <button className="bg-white text-sage px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                    {t('viewStory')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Information Panel */}
      <div className="flex-1 p-4 bg-white">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-display text-xl font-bold text-charcoal">
              {currentRoute.name}
            </h2>
            <span className="text-body text-sm text-charcoal/60 bg-beige px-3 py-1 rounded-full">
              {currentStopIndex + 1}/{currentRoute.places.length}
            </span>
          </div>

          {currentStop && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-charcoal mb-2">{currentStop.name}</h3>
                <p className="text-charcoal/80 text-sm">{currentStop.description}</p>
              </div>

              {navigationInfo && (
                <div className="bg-dustyBlue/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation size={16} className="text-dustyBlue" />
                    <span className="text-charcoal">
                      {Math.round(navigationInfo.distance)}m away, heading {navigationInfo.direction}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-dustyBlue text-white px-4 py-2 rounded-lg hover:bg-dustyBlue/90 transition-colors text-sm">
                  <Play size={16} />
                  {t('audioGuide')}
                </button>

                {currentStop && (
                  <Link href={`/story/${currentStop.id}`}>
                    <button className="flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-lg hover:bg-terracotta/90 transition-colors text-sm">
                      <Image size={16} />
                      {t('viewStory')}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="p-4 bg-cream border-t border-sandstone/20">
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setCurrentStopIndex(Math.max(0, currentStopIndex - 1))}
            disabled={currentStopIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
          >
            {t('previous')}
          </button>
          
          <Link href="/routes">
            <button className="btn-secondary text-sm py-2 w-full">
              <Pause size={16} className="inline mr-1" />
              {t('pauseTour')}
            </button>
          </Link>
          
          <button 
            onClick={() => setCurrentStopIndex(Math.min(currentRoute.places.length - 1, currentStopIndex + 1))}
            disabled={currentStopIndex >= currentRoute.places.length - 1}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
          >
            <SkipForward size={16} className="inline mr-1" />
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
