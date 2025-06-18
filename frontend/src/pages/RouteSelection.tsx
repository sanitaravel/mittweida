import { Link } from "wouter";
import { Filter, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "../hooks/useTranslation";
import RouteCardList from "../components/RouteCardList";
import RouteFilter, { type RouteFilters } from "../components/RouteFilter";
import { type Route } from "../components/RouteCard";
import {
  filterRoutes,
  getAllUniqueFeatures,
  assignColorsToRoutes,
  getColorClass,
} from "../utils/routeUtils";

const routes: Route[] = [
  {
    id: "historical",
    name: "shortHistoricalWalk",
    duration: "30 min",
    stops: 5,
    features: ["benchesAlongWay", "wheelchairAccessible"],
    color: "", // Will be assigned automatically
  },
  {
    id: "church-park",
    name: "churchParkStroll",
    duration: "45 min",
    stops: 4,
    features: ["cafesNearby", "shadedPaths"],
    color: "", // Will be assigned automatically
  },
  {
    id: "university-campus",
    name: "universityCampusTour",
    duration: "60 min",
    stops: 8,
    features: ["wheelchairAccessible", "cafesNearby", "indoorSections"],
    color: "", // Will be assigned automatically
  },
  {
    id: "city-center",
    name: "cityCenterLoop",
    duration: "40 min",
    stops: 6,
    features: ["cafesNearby", "shoppingNearby", "benchesAlongWay"],
    color: "", // Will be assigned automatically
  },
  {
    id: "nature-trail",
    name: "natureTrail",
    duration: "75 min",
    stops: 7,
    features: ["shadedPaths", "scenicViews", "benchesAlongWay"],
    color: "", // Will be assigned automatically
  },
  {
    id: "architectural-highlights",
    name: "architecturalHighlights",
    duration: "50 min",
    stops: 6,
    features: ["wheelchairAccessible", "photoOpportunities"],
    color: "", // Will be assigned automatically
  },
  {
    id: "family-friendly",
    name: "familyFriendlyRoute",
    duration: "35 min",
    stops: 5,
    features: [
      "wheelchairAccessible",
      "playgroundsNearby",
      "cafesNearby",
      "shadedPaths",
    ],
    color: "", // Will be assigned automatically
  },
  {
    id: "quick-highlights",
    name: "quickHighlights",
    duration: "20 min",
    stops: 3,
    features: ["wheelchairAccessible", "photoOpportunities"],
    color: "", // Will be assigned automatically
  },
  {
    id: "evening-stroll",
    name: "eveningStroll",
    duration: "55 min",
    stops: 6,
    features: ["wellLit", "benchesAlongWay", "scenicViews"],
    color: "", // Will be assigned automatically
  },
  {
    id: "student-life",
    name: "studentLifeTour",
    duration: "65 min",
    stops: 9,
    features: ["cafesNearby", "shoppingNearby", "nightlifeNearby"],
    color: "", // Will be assigned automatically
  },
];

const RouteSelection = () => {
  const { t } = useTranslation();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({
    maxDuration: undefined,
    maxStops: undefined,
    minStops: undefined,
    features: [],
  });

  const routesPerPage = 3;
  const minSwipeDistance = 50;
  const filteredRoutes = useMemo(() => {
    const filtered = filterRoutes(routes, filters);
    const startIndex = currentPage * routesPerPage;
    const endIndex = startIndex + routesPerPage;
    const paginatedRoutes = filtered.slice(startIndex, endIndex);
    return assignColorsToRoutes(paginatedRoutes);
  }, [filters, currentPage]);

  const totalAvailableRoutes = useMemo(() => {
    return filterRoutes(routes, filters).length;
  }, [filters]);

  const totalPages = Math.ceil(totalAvailableRoutes / routesPerPage);
  // Reset to first page when filters change
  const handleFiltersChange = (newFilters: RouteFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  // Touch/swipe handlers for mobile carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const availableFeatures = useMemo(() => {
    return getAllUniqueFeatures(routes);
  }, []);

  const hasActiveFilters =
    filters.maxDuration ||
    filters.maxStops ||
    filters.minStops ||
    filters.features.length > 0;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Map Area */}
      <div className="h-[60vh] bg-sandstone/20 relative">
        {" "}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`bg-white p-3 rounded-xl shadow-lg hover:bg-beige transition-colors ${
              hasActiveFilters ? "ring-2 ring-sage" : ""
            }`}
          >
            <Filter size={24} className="text-charcoal" />
          </button>
        </div>{" "}
        {/* Placeholder map with route visualization */}
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-body text-lg text-charcoal/60 mb-4">
              {t("interactiveMap")}
            </div>
            <div className="space-y-2 text-sm text-charcoal/80">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{t("yourLocation")}</span>
              </div>{" "}
              {filteredRoutes.map((route) => {
                return (
                  <div
                    key={route.id}
                    className="flex items-center justify-center gap-2"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${getColorClass(
                        route.color
                      )}`}
                    ></div>
                    <span className="text-xs">{t(route.name as any)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Route Details */}
      <div className="flex-1 p-6">
        <p className="text-body text-lg text-charcoal/80 mb-6">
          {t("tapOnRoute")}
        </p>{" "}
        {/* Mobile Carousel Container */}
        <div
          className="md:hidden relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="transition-opacity duration-200 ease-out">
            <RouteCardList
              routes={filteredRoutes}
              selectedRouteId={selectedRoute}
              onRouteSelect={setSelectedRoute}
              className="mb-4"
            />
          </div>

          {/* Mobile pagination dots */}
          {totalAvailableRoutes > routesPerPage && (
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPage ? "bg-sage" : "bg-charcoal/20"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Mobile swipe hint */}
          {totalAvailableRoutes > routesPerPage && (
            <div className="text-center mb-4">
              <p className="text-xs text-charcoal/50">{t("swipeToNavigate")}</p>
            </div>
          )}
        </div>
        {/* Desktop/Tablet List */}
        <div className="hidden md:block">
          <RouteCardList
            routes={filteredRoutes}
            selectedRouteId={selectedRoute}
            onRouteSelect={setSelectedRoute}
            className="mb-4"
          />
        </div>
        {/* Desktop/Tablet Pagination Controls */}
        {totalAvailableRoutes > routesPerPage && (
          <div className="hidden md:flex items-center justify-between mb-4">
            <div className="text-sm text-charcoal/60">
              {t("showingRoutes", {
                start: (currentPage * routesPerPage + 1).toString(),
                end: Math.min(
                  (currentPage + 1) * routesPerPage,
                  totalAvailableRoutes
                ).toString(),
                total: totalAvailableRoutes.toString(),
              })}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-charcoal/20 hover:bg-beige disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={t("previousPage")}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-charcoal/80 px-2">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-charcoal/20 hover:bg-beige disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={t("nextPage")}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}{" "}
        {/* Desktop/Tablet: Show simple indicator if all routes fit on one page */}
        {totalAvailableRoutes <= routesPerPage && totalAvailableRoutes > 0 && (
          <div className="hidden md:block text-center mb-4">
            <p className="text-sm text-charcoal/60">
              {t("showingAllRoutes", {
                total: totalAvailableRoutes.toString(),
              })}
            </p>
          </div>
        )}{" "}
        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link href="/" className="flex-1">
            <button className="btn-secondary w-full">
              <div className="flex items-center justify-center gap-2">
                <ArrowLeft size={20} />
                {t("back")}
              </div>
            </button>
          </Link>
          <Link href="/tour/historical" className="flex-1">
            <button
              className={`btn-primary w-full ${
                !selectedRoute ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!selectedRoute}
            >
              {t("continue")}
            </button>
          </Link>{" "}
        </div>
      </div>
      {/* Route Filter Modal */}
      <RouteFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableFeatures={availableFeatures}
      />
    </div>
  );
};

export default RouteSelection;
