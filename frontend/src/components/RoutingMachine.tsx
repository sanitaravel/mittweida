import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import type { ControlOptions } from "leaflet";
import "leaflet-routing-machine";
import { getColorValue } from "../utils/routeUtils";
import { routeCache } from "../utils/routeCache";

interface RoutingMachineProps extends ControlOptions {
  waypoints: L.LatLng[];
  color?: string;
  routeWhileDragging?: boolean;
  addWaypoints?: boolean;
  show?: boolean;
  showWaypoints?: boolean;
  delay?: number; // Delay in milliseconds before making the request
}

// Custom router with caching
const createCachedRouter = () => {
  return {
    route: function(waypoints: any[], callback: any, context: any) {
      // Check cache first
      const cachedRoute = routeCache.get(waypoints);
      if (cachedRoute) {
        console.log('Using cached route for waypoints:', waypoints.length);
        // Call the callback with cached data
        setTimeout(() => {
          if (callback) {
            callback.call(context, null, [cachedRoute]);
          }
        }, 0);
        return;
      }

      // If not in cache, make the API call using fetch
      console.log('Fetching new route from API for waypoints:', waypoints.length);
      
      const coordinates = waypoints.map((wp: any) => `${wp.lng},${wp.lat}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            
            // Transform OSRM response to leaflet-routing-machine format
            const transformedRoute = {
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

            // Cache the successful response
            routeCache.set(waypoints, transformedRoute);

            // Call the callback
            if (callback) {
              callback.call(context, null, [transformedRoute]);
            }
          } else {
            if (callback) {
              callback.call(context, new Error('No route found'), []);
            }
          }
        })
        .catch(error => {
          console.error('Route API error:', error);
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
    color = "blue",
    routeWhileDragging = false,
    addWaypoints = false,
    showWaypoints = true,
    delay = 0,
  } = props;

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
    router: createCachedRouter(),
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
