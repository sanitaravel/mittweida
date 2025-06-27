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
      if (route.duration > filters.maxDuration) {
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

    const waypoints = route.places.map((place) =>
      L.latLng(place.coordinates[0], place.coordinates[1])
    );

    // Check if already cached
    const cached = routeCache.get(waypoints);
    if (!cached) {
      // Simulate API call delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        const coordinates = waypoints
          .map((wp) => `${wp.lng},${wp.lat}`)
          .join(";");
        const url = `https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const apiRoute = data.routes[0];

          // Transform OSRM response to leaflet-routing-machine format
          const transformedRoute = {
            name: "",
            coordinates: apiRoute.geometry.coordinates.map((coord: number[]) =>
              L.latLng(coord[1], coord[0])
            ),
            instructions: [],
            summary: {
              totalDistance: apiRoute.distance,
              totalTime: apiRoute.duration,
            },
            inputWaypoints: waypoints,
            actualWaypoints: waypoints,
            waypoints: waypoints,
          };

          routeCache.set(waypoints, transformedRoute);
          console.log(`Cached route for ${route.name}`);
        }
      } catch (error) {
        console.warn(`Failed to preload route for ${route.name}:`, error);
      }
    }
  }

  console.log("Route cache preloading completed");
};

// Debug utilities for development
export const debugRouteCache = () => {
  const stats = getCacheStats();
  console.group("Route Cache Debug Info");
  console.log("Cache Stats:", stats);
  if (stats.oldestEntry) {
    console.log(
      "Oldest Entry:",
      new Date(stats.oldestEntry).toLocaleString()
    );
  }
  if (stats.newestEntry) {
    console.log(
      "Newest Entry:",
      new Date(stats.newestEntry).toLocaleString()
    );
  }
  console.groupEnd();
};

// Make debug function available globally for development
if (typeof window !== "undefined") {
  (window as any).debugRouteCache = debugRouteCache;
  (window as any).clearRouteCache = clearRouteCache;
  (window as any).routeCache = routeCache;
}
