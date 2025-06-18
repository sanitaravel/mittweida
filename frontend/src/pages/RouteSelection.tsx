import { Link } from "wouter";
import { Filter, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

interface Route {
  id: string;
  name: string;
  duration: string;
  stops: number;
  features: string[];
  color: string;
}

const routes: Route[] = [
  {
    id: "historical",
    name: "shortHistoricalWalk",
    duration: "30 min",
    stops: 5,
    features: ["benchesAlongWay", "wheelchairAccessible"],
    color: "green",
  },
  {
    id: "church-park",
    name: "churchParkStroll",
    duration: "45 min",
    stops: 4,
    features: ["cafesNearby", "shadedPaths"],
    color: "orange",
  },
];

const RouteSelection = () => {
  const { t } = useTranslation();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Map Area */}
      <div className="h-[60vh] bg-sandstone/20 relative">
        <div className="absolute top-4 right-4">
          <button className="bg-white p-3 rounded-xl shadow-lg hover:bg-beige transition-colors">
            <Filter size={24} className="text-charcoal" />
          </button>
        </div>        {/* Placeholder map with route visualization */}
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-body text-lg text-charcoal/60 mb-4">
              {t("interactiveMap")}
            </div>
            <div className="space-y-2 text-sm text-charcoal/80">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{t("yourLocation")}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{t("historicalRoute")} (1-5)</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>{t("churchRoute")} (A-D)</span>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Route Details */}
      <div className="flex-1 p-6">
        <p className="text-body text-lg text-charcoal/80 mb-6">
          {t("tapOnRoute")}
        </p>

        <div className="space-y-4 mb-8">
          {routes.map((route) => (
            <div
              key={route.id}
              className={`card cursor-pointer transition-all duration-200 ${
                selectedRoute === route.id
                  ? "ring-2 ring-sage bg-sage/10"
                  : "hover:bg-sandstone/10"
              }`}
              onClick={() => setSelectedRoute(route.id)}
            >
              <h3 className="text-display text-xl font-semibold text-charcoal mb-2">
                {t(route.name as any)} ({route.duration})
              </h3>
              <p className="text-body text-charcoal/80 mb-3">
                • {route.stops} {t("stops")}, {route.features.map(feature => t(feature as any)).join(", ")}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/tour/historical">
            <button
              className={`btn-primary ${
                !selectedRoute ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!selectedRoute}
            >
              {t("continue")}
            </button>
          </Link>

          <Link href="/">
            <button className="btn-secondary">
              <div className="flex items-center justify-center gap-2">
                <ArrowLeft size={20} />
                {t("back")}
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RouteSelection;
