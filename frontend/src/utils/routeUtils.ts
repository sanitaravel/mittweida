import type { Route } from "../components/RouteCard";
import type { RouteFilters } from "../components/RouteFilter";

// Color palette for route assignment
const ROUTE_COLORS = [
  "green",
  "orange",
  "blue",
  "red",
  "purple",
  "teal",
  "yellow",
  "pink",
] as const;

export type RouteColor = typeof ROUTE_COLORS[number];

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
    red: "bg-red-500",
    purple: "bg-purple-500",
    teal: "bg-teal-500",
    yellow: "bg-yellow-500",
    pink: "bg-pink-500",
  };
  return colorMap[color] || "bg-gray-500";
};

export const getColorValue = (color: string): string => {
  const colorMap: Record<string, string> = {
    green: "#22c55e",
    orange: "#f97316",
    blue: "#3b82f6",
    red: "#ef4444",
    purple: "#a855f7",
    teal: "#14b8a6",
    yellow: "#eab308",
    pink: "#ec4899",
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
      const routeDurationInMinutes = parseInt(
        route.duration.replace(/\D/g, "")
      );
      if (routeDurationInMinutes > filters.maxDuration) {
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
