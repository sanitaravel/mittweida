import type { Route } from "../components/RouteCard";
import type { RouteFilters } from "../components/RouteFilter";

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
