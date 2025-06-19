import { useTranslation } from "../hooks/useTranslation";
import { MapPin, Clock } from "lucide-react";
import FeatureChip from "./FeatureChip";
import { getColorClass, getColorValue } from "../utils/routeUtils";

export interface Place {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  type:
    | "attraction"
    | "restaurant"
    | "shop"
    | "landmark"
    | "park"
    | "museum"
    | "viewpoint";
  estimatedVisitTime: number; // in minutes
}

export interface Route {
  id: string;
  name: string;
  duration: string;
  stops: number;
  features: string[];
  color: string;
  places: Place[];
  description: string;
  startPoint: [number, number];
  endPoint: [number, number];
}

interface RouteCardProps {
  route: Route;
  isSelected: boolean;
  onSelect: (routeId: string) => void;
  showColorIndicator?: boolean;
  className?: string;
}

const RouteCard = ({
  route,
  isSelected,
  onSelect,
  showColorIndicator = true,
  className = "",
}: RouteCardProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={`card cursor-pointer transition-all duration-150 ease-out ${
        isSelected ? "shadow-lg" : "hover:bg-sandstone/10 hover:shadow-md"
      } ${className}`}
      style={
        {
          "--route-color": getColorValue(route.color),
          outline: isSelected ? `0.25rem solid var(--route-color)` : "none",
          outlineOffset: "-0.25rem",
          backgroundColor: isSelected
            ? `color-mix(in srgb, var(--route-color) 3%, transparent)`
            : "",
          transition: "outline 0.05s ease-out, background-color 0.05s ease-out",
        } as React.CSSProperties & { "--route-color": string }
      }
      onClick={() => onSelect(route.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(route.id);
        }
      }}
      aria-pressed={isSelected}
      aria-label={`Select ${t(route.name as any)} route`}
    >
      {" "}
      <div className="flex items-center gap-2 mb-3">
        {showColorIndicator && (
          <div
            className={`w-3 h-3 rounded-full ${getColorClass(route.color)}`}
          />
        )}
        <h3 className="text-display text-xl font-semibold text-charcoal">
          {t(route.name as any)}
        </h3>
      </div>{" "}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1 text-charcoal/80">
          <Clock size={18} />
          <span className="text-body font-medium">{route.duration}</span>
        </div>
        <div className="flex items-center gap-1 text-charcoal/50">
          <MapPin size={14} />
          <span className="text-sm">
            {route.stops} {t("stops")}
          </span>
        </div>{" "}
      </div>
      <div className="flex flex-wrap gap-2">
        {route.features.map((feature) => (
          <FeatureChip key={feature} feature={feature} />
        ))}
      </div>
    </div>
  );
};

export default RouteCard;
export type { RouteCardProps };
