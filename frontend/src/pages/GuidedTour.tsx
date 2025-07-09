import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { mittweidaRoutes } from '../data/routes';
import NavigationMap from '../components/NavigationMap';

interface Route {
  id: string;
  name: string;
  description: string;
  places: any[];
  color: string;
}

const GuidedTour = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const [, setLocation] = useLocation();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Find the current route
  const route = mittweidaRoutes.find(r => r.id === routeId) as Route | undefined;

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
    <div className="h-screen w-full">
      <NavigationMap
        route={route}
        userLocation={userLocation}
        className="h-full"
      />
    </div>
  );
};

export default GuidedTour;
