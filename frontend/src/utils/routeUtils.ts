import type { Route } from "../components/RouteCard";
import type { RouteFilters } from "../components/RouteFilter";

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
