import { Link } from "wouter";
import {
  Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "../hooks/useTranslation";
import RouteCardList from "../components/RouteCardList";
import RouteFilter, { type RouteFilters } from "../components/RouteFilter";
import FeatureChip from "../components/FeatureChip";
import Map from "../components/Map";
import {
  filterRoutes,
  getAllUniqueFeatures,
  assignColorsToRoutes,
  getColorClass,
  formatDuration,
} from "../utils/routeUtils";
import { mittweidaRoutes } from "../data/routes";

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
  // Use the comprehensive route data
  const routes = mittweidaRoutes;

  // Assign colors to all routes once and keep them stable
  const routesWithColors = useMemo(() => {
    return assignColorsToRoutes(routes);
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    const filtered = filterRoutes(routesWithColors, filters);
    const startIndex = currentPage * routesPerPage;
    const endIndex = startIndex + routesPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [routesWithColors, filters, currentPage]);
  const totalAvailableRoutes = useMemo(() => {
    return filterRoutes(routesWithColors, filters).length;
  }, [routesWithColors, filters]);

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
    return getAllUniqueFeatures(routesWithColors);
  }, [routesWithColors]);

  const hasActiveFilters =
    filters.maxDuration ||
    filters.maxStops ||
    filters.minStops ||
    filters.features.length > 0;
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {selectedRoute ? (
        // Full-screen map view with route overlay
        <div className="h-screen relative">
          {" "}
          {/* Full-screen Map */}
          <Map
            className="h-full"
            routes={routesWithColors.filter((r) => r.id === selectedRoute)}
            selectedRouteId={selectedRoute}
            onRouteSelect={setSelectedRoute}
            showRoutePaths={true}
          />
          {/* Route Card Overlay */}
          <div className="absolute bottom-6 left-4 right-4 z-[1000]">
            {(() => {
              const route = routesWithColors.find(
                (r) => r.id === selectedRoute
              );
              if (!route) return null;

              return (
                <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-auto">
                  {/* Route Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-display text-xl font-semibold text-charcoal mb-2">
                        {route.name}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-charcoal/70 mb-3">
                        {" "}
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{formatDuration(route.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{route.stops} stops</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full ${getColorClass(
                        route.color
                      )}`}
                    />
                  </div>

                  {/* Route Description */}
                  <p className="text-body text-charcoal/80 mb-4 leading-relaxed">
                    {route.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-6">
                    {route.features.map((feature) => (
                      <FeatureChip key={feature} feature={feature} />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedRoute(null)}
                      className="flex-1 px-4 py-3 text-charcoal border border-charcoal/20 rounded-lg hover:bg-beige transition-colors"
                    >
                      Back
                    </button>
                    <button className="flex-1 px-4 py-3 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors">
                      Continue
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        // Normal view with map and route list
        <>
          {/* Map Area */}
          <div className="h-[60vh] bg-sandstone/20 relative">
            <div className="absolute top-4 right-4 z-[1000]">
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`bg-white p-3 rounded-xl shadow-lg hover:bg-beige transition-colors ${
                  hasActiveFilters ? "ring-2 ring-sage" : ""
                }`}
              >
                <Filter size={24} className="text-charcoal" />
              </button>
            </div>{" "}
            {/* Leaflet Map */}
            <Map
              className="h-full"
              routes={filteredRoutes}
              selectedRouteId={selectedRoute}
              onRouteSelect={setSelectedRoute}
              showRoutePaths={false}
            />
            {/* Route legend overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg max-w-xs">
              <div className="text-sm font-medium text-charcoal mb-2">
                Routes
              </div>
              <div className="space-y-1 text-xs text-charcoal/80">
                {filteredRoutes.map((route) => (
                  <div key={route.id} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getColorClass(
                        route.color
                      )}`}
                    ></div>
                    <span>{t(route.name as any)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                  <p className="text-xs text-charcoal/50">
                    {t("swipeToNavigate")}
                  </p>
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
            {totalAvailableRoutes <= routesPerPage &&
              totalAvailableRoutes > 0 && (
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
                  {t("continue")}{" "}
                </button>
              </Link>
            </div>
          </div>
        </>
      )}

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
