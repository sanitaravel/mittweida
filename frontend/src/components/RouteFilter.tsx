import { useState } from "react";
import { X, Clock, MapPin, Navigation, Sliders } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import FeatureChip from "./FeatureChip";

export interface RouteFilters {
  maxDuration?: number; // in minutes
  maxStops?: number;
  minStops?: number;
  features: string[];
}

interface RouteFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RouteFilters;
  onFiltersChange: (filters: RouteFilters) => void;
  availableFeatures: string[];
}

const RouteFilter = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableFeatures,
}: RouteFilterProps) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<RouteFilters>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: RouteFilters = {
      maxDuration: undefined,
      maxStops: undefined,
      minStops: undefined,
      features: [],
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const toggleFeature = (feature: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sandstone/20 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-charcoal" />
            <h2 className="text-display text-xl font-semibold text-charcoal">
              {t("filterRoutes")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sandstone/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-charcoal/60" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Filter Content */}
          <div className="p-6 space-y-6">
            {/* Duration Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-charcoal/60" />
                <label className="text-body font-medium text-charcoal">
                  {t("maxDuration")}
                </label>
              </div>
              <div className="space-y-2">
                {" "}
                <input
                  type="range"
                  min="15"
                  max="240"
                  step="15"
                  value={localFilters.maxDuration || 240}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      maxDuration: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-sandstone/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-charcoal/60">
                  <span>15 min</span>
                  <span className="font-medium text-charcoal">
                    {localFilters.maxDuration || 240} min
                  </span>
                  <span>4h</span>
                </div>
              </div>
            </div>

            {/* Number of Stops Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-charcoal/60" />
                <label className="text-body font-medium text-charcoal">
                  {t("numberOfStops")}
                </label>
              </div>{" "}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-charcoal/60 mb-1">
                    {t("minimum")}
                  </label>
                  <select
                    value={localFilters.minStops || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => {
                        const newMinStops = e.target.value
                          ? parseInt(e.target.value)
                          : undefined;
                        return {
                          ...prev,
                          minStops: newMinStops,
                          // If new minimum is greater than current maximum, clear maximum
                          maxStops:
                            prev.maxStops &&
                            newMinStops &&
                            prev.maxStops < newMinStops
                              ? undefined
                              : prev.maxStops,
                        };
                      })
                    }
                    className="w-full p-2 border border-sandstone/30 rounded-lg bg-white text-charcoal"
                  >
                    <option value="">{t("any")}</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                      .filter(
                        (num) =>
                          !localFilters.maxStops || num <= localFilters.maxStops
                      )
                      .map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-charcoal/60 mb-1">
                    {t("maximum")}
                  </label>
                  <select
                    value={localFilters.maxStops || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => {
                        const newMaxStops = e.target.value
                          ? parseInt(e.target.value)
                          : undefined;
                        return {
                          ...prev,
                          maxStops: newMaxStops,
                          // If new maximum is less than current minimum, clear minimum
                          minStops:
                            prev.minStops &&
                            newMaxStops &&
                            prev.minStops > newMaxStops
                              ? undefined
                              : prev.minStops,
                        };
                      })
                    }
                    className="w-full p-2 border border-sandstone/30 rounded-lg bg-white text-charcoal"
                  >
                    <option value="">{t("any")}</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                      .filter(
                        (num) =>
                          !localFilters.minStops || num >= localFilters.minStops
                      )
                      .map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Features Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Navigation size={16} className="text-charcoal/60" />
                <label className="text-body font-medium text-charcoal">
                  {t("routeFeatures")}
                </label>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-charcoal/60">
                  {t("selectDesiredFeatures")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={`transition-all duration-150 ${
                        localFilters.features.includes(feature)
                          ? "ring-2 ring-sage"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <FeatureChip feature={feature} />
                    </button>
                  ))}{" "}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-sandstone/20 bg-white flex-shrink-0">
          <button onClick={handleClearFilters} className="btn-secondary flex-1">
            {t("clearAll")}
          </button>
          <button onClick={handleApplyFilters} className="btn-primary flex-1">
            {t("applyFilters")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteFilter;
export type { RouteFilterProps };
