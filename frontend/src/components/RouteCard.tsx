import { useTranslation } from "../hooks/useTranslation";
import { MapPin, Clock } from "lucide-react";
import FeatureChip from "./FeatureChip";

interface Route {
  id: string;
  name: string;
  duration: string;
  stops: number;
  features: string[];
  color: string;
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
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      green: "bg-green-500",
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
    };
    return colorMap[color] || "bg-gray-500";
  };

  const getColorValue = (color: string) => {
    const colorMap: Record<string, string> = {
      green: "#22c55e",
      orange: "#f97316",
      blue: "#3b82f6",
      red: "#ef4444",
      purple: "#a855f7",
    };
    return colorMap[color] || "#6b7280";
  };
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
          <MapPin size={16} />
          <span className="text-body">
            {route.stops} {t("stops")}
          </span>
        </div>
        <div className="flex items-center gap-1 text-charcoal/60">
          <Clock size={16} />
          <span className="text-sm">{route.duration}</span>
        </div>      </div>
      <div className="flex flex-wrap gap-2">
        {route.features.map((feature) => (
          <FeatureChip key={feature} feature={feature} />
        ))}
      </div>
    </div>
  );
};

export default RouteCard;
export type { Route, RouteCardProps };
