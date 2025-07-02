import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import type { ControlOptions } from "leaflet";
import "leaflet-routing-machine";
import { getColorValue } from "../utils/routeUtils";
import { routeCache } from "../utils/routeCache";

interface RoutingMachineProps extends ControlOptions {
  waypoints: L.LatLng[];
  routeId?: string; // Add route ID for caching
  color?: string;
  routeWhileDragging?: boolean;
  addWaypoints?: boolean;
  show?: boolean;
  showWaypoints?: boolean;
  delay?: number; // Delay in milliseconds before making the request
}

// Custom router with caching
const createCachedRouter = (routeId?: string) => {
  return {
    route: function(waypoints: any[], callback: any, context: any) {
      console.log('[RoutingMachine] Route request:', {
        routeId,
        waypointCount: waypoints.length,
        waypoints: waypoints.map((wp, index) => ({
          index,
          type: typeof wp,
          isLatLng: wp instanceof L.LatLng,
          hasLatLng: wp && typeof wp.lat !== 'undefined' && typeof wp.lng !== 'undefined',
          lat: wp?.lat,
          lng: wp?.lng
        }))
      });

      // Convert waypoints to proper format
      let normalizedWaypoints: L.LatLng[];
      try {
        normalizedWaypoints = waypoints.map((wp, index) => {
          // Handle different waypoint formats
          if (wp instanceof L.LatLng) {
            return wp;
          } else if (wp && typeof wp.lat === 'number' && typeof wp.lng === 'number') {
            return L.latLng(wp.lat, wp.lng);
          } else if (wp && typeof wp.lat === 'function' && typeof wp.lng === 'function') {
            // Some versions of leaflet have lat/lng as methods
            return L.latLng(wp.lat(), wp.lng());
          } else if (wp && wp.latLng && wp.latLng instanceof L.LatLng) {
            // Some waypoint objects wrap the LatLng
            return wp.latLng;
          } else if (wp && wp.latLng && typeof wp.latLng.lat === 'number' && typeof wp.latLng.lng === 'number') {
            return L.latLng(wp.latLng.lat, wp.latLng.lng);
          } else {
            console.error('[RoutingMachine] Unknown waypoint format at index', index, ':', wp);
            throw new Error(`Invalid waypoint format at index ${index}`);
          }
        });

        console.log('[RoutingMachine] Normalized waypoints:', {
          count: normalizedWaypoints.length,
          waypoints: normalizedWaypoints.map(wp => ({ lat: wp.lat, lng: wp.lng }))
        });
      } catch (error) {
        console.error('[RoutingMachine] Failed to normalize waypoints:', error);
        if (callback) {
          callback.call(context, error, []);
        }
        return;
      }

      // Use route ID for caching if available, otherwise fall back to waypoint-based key
      const cacheKey = routeId || normalizedWaypoints;
      
      // Check cache first
      const cachedData = routeCache.get(cacheKey);
      if (cachedData) {
        console.log('[RoutingMachine] Cache HIT for:', routeId ? `route ID: ${routeId}` : 'waypoint coordinates');
        
        // Reconstruct the route object with proper Leaflet LatLng objects
        const reconstructedRoute = {
          ...cachedData,
          coordinates: cachedData.coordinates.map((coord: any) => 
            L.latLng(coord.lat, coord.lng)
          ),
          inputWaypoints: waypoints,
          actualWaypoints: waypoints,
          waypoints: waypoints
        };

        // Call the callback with cached data
        setTimeout(() => {
          if (callback) {
            callback.call(context, null, [reconstructedRoute]);
          }
        }, 0);
        return;
      }

      // If not in cache, make the API call using fetch
      console.log('[RoutingMachine] Cache MISS for:', routeId ? `route ID: ${routeId}` : 'waypoint coordinates', '- fetching from OSRM API');
      
      const coordinates = normalizedWaypoints.map((wp: any) => `${wp.lng},${wp.lat}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson`;

      console.log('[RoutingMachine] OSRM API URL:', url);

      fetch(url)
        .then(response => {
          console.log('[RoutingMachine] OSRM API response status:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('[RoutingMachine] OSRM API response data:', {
            code: data.code,
            hasRoutes: !!data.routes,
            routeCount: data.routes?.length || 0
          });

          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            
            console.log('[RoutingMachine] Processing OSRM route:', {
              distance: route.distance,
              duration: route.duration,
              coordinateCount: route.geometry.coordinates.length
            });

            // Create the route object for leaflet-routing-machine
            const leafletRoute = {
              name: '',
              coordinates: route.geometry.coordinates.map((coord: number[]) => 
                L.latLng(coord[1], coord[0])
              ),
              instructions: [],
              summary: {
                totalDistance: route.distance,
                totalTime: route.duration
              },
              inputWaypoints: waypoints,
              actualWaypoints: waypoints,
              waypoints: waypoints
            };

            // Create a serializable version for caching (without Leaflet objects)
            const cacheableRoute = {
              name: '',
              coordinates: route.geometry.coordinates.map((coord: number[]) => ({
                lat: coord[1],
                lng: coord[0]
              })),
              instructions: [],
              summary: {
                totalDistance: route.distance,
                totalTime: route.duration
              }
            };

            console.log('[RoutingMachine] Caching route data:', {
              coordinateCount: cacheableRoute.coordinates.length,
              distance: cacheableRoute.summary.totalDistance,
              duration: cacheableRoute.summary.totalTime
            });

            // Cache the serializable version using route ID if available
            routeCache.set(cacheKey, cacheableRoute);

            // Call the callback with the Leaflet version
            if (callback) {
              callback.call(context, null, [leafletRoute]);
            }
          } else {
            console.error('[RoutingMachine] OSRM API error or no route found:', data);
            if (callback) {
              callback.call(context, new Error('No route found'), []);
            }
          }
        })
        .catch(error => {
          console.error('[RoutingMachine] OSRM API fetch error:', error);
          if (callback) {
            callback.call(context, error, []);
          }
        });
    }
  };
};

const createRoutingMachineLayer = (props: RoutingMachineProps) => {
  const {
    waypoints,
    routeId,
    color = "blue",
    routeWhileDragging = false,
    addWaypoints = false,
    showWaypoints = true,
    delay = 0,
  } = props;

  console.log('[RoutingMachine] Creating routing machine layer:', {
    routeId,
    waypointCount: waypoints.length,
    color,
    delay
  });

  const instance = (L as any).Routing.control({
    waypoints: waypoints,
    routeWhileDragging,
    addWaypoints,
    createMarker: function (i: number, waypoint: any) {
      // Only create markers if showWaypoints is true
      if (!showWaypoints) {
        return null;
      }
      
      // Create a custom numbered marker
      const marker = L.marker(waypoint.latLng, {
        icon: L.divIcon({
          className: "numbered-waypoint-marker",
          html: `<div class="waypoint-number">${i + 1}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      });
      return marker;
    },
    router: createCachedRouter(routeId),
    lineOptions: {
      styles: [
        {
          color: getColorValue(color),
          weight: 4,
          opacity: 0.7,
        },
      ],
    },
  });

  // Hide the control container
  instance.on("add", function () {
    const container = instance.getContainer();
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  // Add delay if specified to respect API rate limits
  if (delay > 0) {
    const originalRoute = instance.route;
    instance.route = function(...args: any[]) {
      setTimeout(() => {
        originalRoute.apply(this, args);
      }, delay);
    };
  }

  return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;
