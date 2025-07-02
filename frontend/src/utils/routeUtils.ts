import type { Route } from "../components/RouteCard";
import type { RouteFilters } from "../components/RouteFilter";
import { routeCache } from "./routeCache";
import L from "leaflet";

// Format duration in minutes to readable string (e.g., 150 -> "2h 30min")
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
};

// Color palette for route assignment
const ROUTE_COLORS = ["green", "orange", "blue"] as const;

export type RouteColor = (typeof ROUTE_COLORS)[number];

export const assignColorsToRoutes = (routes: Route[]): Route[] => {
  return routes.map((route, index) => ({
    ...route,
    color: ROUTE_COLORS[index % ROUTE_COLORS.length],
  }));
};

export const getColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    green: "bg-green-500",
    orange: "bg-orange-500",
    blue: "bg-blue-500",
  };
  return colorMap[color] || "bg-gray-500";
};

export const getColorValue = (color: string): string => {
  const colorMap: Record<string, string> = {
    green: "#22c55e",
    orange: "#f97316",
    blue: "#3b82f6",
  };
  return colorMap[color] || "#6b7280";
};

export const filterRoutes = (
  routes: Route[],
  filters: RouteFilters
): Route[] => {
  return routes.filter((route) => {
    // Duration filter
    if (filters.maxDuration) {
      const routingTime = getRoutingTimeFromCache(route.id);
      const totalDuration = calculateRouteDuration(route, routingTime);
      if (totalDuration > filters.maxDuration) {
        return false;
      }
    }

    // Stops filter
    if (filters.minStops && route.stops < filters.minStops) {
      return false;
    }
    if (filters.maxStops && route.stops > filters.maxStops) {
      return false;
    }

    // Features filter
    if (filters.features.length > 0) {
      const hasAllFeatures = filters.features.every((feature) =>
        route.features.includes(feature)
      );
      if (!hasAllFeatures) {
        return false;
      }
    }

    return true;
  });
};

export const getAllUniqueFeatures = (routes: Route[]): string[] => {
  const allFeatures = routes.flatMap((route) => route.features);
  return [...new Set(allFeatures)];
};

// Route cache management utilities
export const getCacheStats = () => {
  return routeCache.getStats();
};

export const clearRouteCache = () => {
  routeCache.clear();
  console.log("Route cache cleared");
};

export const preloadRouteCache = async (routes: Route[]) => {
  console.log("Preloading route cache for", routes.length, "routes");

  for (const route of routes) {
    if (route.places.length < 2) continue;

    // Check if already cached using route ID
    const cached = routeCache.get(route.id);
    if (!cached) {
      console.log(`Cache miss for route ${route.id}, fetching from API...`);

      const waypoints = route.places.map((place) =>
        L.latLng(place.coordinates[0], place.coordinates[1])
      );

      // Simulate API call delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        const coordinates = waypoints
          .map((wp) => `${wp.lng},${wp.lat}`)
          .join(";");
        const url = `https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson`;

        console.log(`Fetching route data for ${route.name} (${route.id})`);
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const apiRoute = data.routes[0];

          // Create a serializable version for caching (consistent with RoutingMachine)
          const cacheableRoute = {
            name: "",
            coordinates: apiRoute.geometry.coordinates.map(
              (coord: number[]) => ({
                lat: coord[1],
                lng: coord[0],
              })
            ),
            instructions: [],
            summary: {
              totalDistance: apiRoute.distance,
              totalTime: apiRoute.duration,
            },
          };

          // Cache using route ID (consistent with RoutingMachine)
          routeCache.set(route.id, cacheableRoute);
          console.log(`Successfully cached route: ${route.name} (${route.id})`);
        } else {
          console.warn(`No route found for ${route.name} (${route.id})`);
        }
      } catch (error) {
        console.warn(
          `Failed to preload route for ${route.name} (${route.id}):`,
          error
        );
      }
    } else {
      console.log(`Route ${route.id} already cached, skipping`);
    }
  }

  console.log("Route cache preloading completed");
};

// Calculate total route duration including travel time and visit times
export const calculateRouteDuration = (
  route: Route,
  routingTimeMinutes?: number
): number => {
  // Sum all estimated visit times
  const totalVisitTime = route.places.reduce(
    (sum, place) => sum + place.estimatedVisitTime,
    0
  );

  // Add routing time if available, otherwise return just visit time
  const totalRoutingTime = routingTimeMinutes || 0;

  return totalVisitTime + totalRoutingTime;
};

// Get routing time from cache if available
export const getRoutingTimeFromCache = (routeId: string): number => {
  const cached = routeCache.get(routeId);
  if (cached && cached.summary?.totalTime) {
    // Convert from seconds to minutes
    return Math.round(cached.summary.totalTime / 60);
  }
  return 0;
};

// Debug utilities for development
export const debugRouteCache = () => {
  const stats = getCacheStats();
  console.group("Route Cache Debug Info");
  console.log("Cache Stats:", stats);
  if (stats.oldestEntry) {
    console.log("Oldest Entry:", new Date(stats.oldestEntry).toLocaleString());
  }
  if (stats.newestEntry) {
    console.log("Newest Entry:", new Date(stats.newestEntry).toLocaleString());
  }
  console.groupEnd();
};

// Make debug function available globally for development
if (typeof window !== "undefined") {
  (window as any).debugRouteCache = debugRouteCache;
  (window as any).clearRouteCache = clearRouteCache;
  (window as any).routeCache = routeCache;
}
