import { useTranslation } from "../hooks/useTranslation";
import { MapPin, Coffee, Trees, Accessibility } from "lucide-react";

interface FeatureChipProps {
  feature: string;
  className?: string;
}

const FeatureChip = ({ feature, className = "" }: FeatureChipProps) => {
  const { t } = useTranslation();

  const getFeatureConfig = (feature: string) => {
    const featureMap = {
      benchesAlongWay: {
        icon: MapPin,
        color: "bg-blue-100 text-blue-700 border-blue-200",
        hoverColor: "hover:bg-blue-200",
      },
      wheelchairAccessible: {
        icon: Accessibility,
        color: "bg-green-100 text-green-700 border-green-200",
        hoverColor: "hover:bg-green-200",
      },
      cafesNearby: {
        icon: Coffee,
        color: "bg-amber-100 text-amber-700 border-amber-200",
        hoverColor: "hover:bg-amber-200",
      },
      shadedPaths: {
        icon: Trees,
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        hoverColor: "hover:bg-emerald-200",
      },
    };

    return (
      featureMap[feature as keyof typeof featureMap] || {
        icon: MapPin,
        color: "bg-gray-100 text-gray-700 border-gray-200",
        hoverColor: "hover:bg-gray-200",
      }
    );
  };

  const config = getFeatureConfig(feature);
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 ${config.color} ${config.hoverColor} ${className}`}
    >
      <Icon size={12} />
      <span>{t(feature as any)}</span>
    </div>
  );
};

export default FeatureChip;
export type { FeatureChipProps };
