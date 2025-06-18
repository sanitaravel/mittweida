import RouteCard, { type Route } from "./RouteCard";

interface RouteCardListProps {
  routes: Route[];
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string) => void;
  className?: string;
  showColorIndicators?: boolean;
}

const RouteCardList = ({
  routes,
  selectedRouteId,
  onRouteSelect,
  className = "",
  showColorIndicators = true,
}: RouteCardListProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          isSelected={selectedRouteId === route.id}
          onSelect={onRouteSelect}
          showColorIndicator={showColorIndicators}
        />
      ))}
    </div>
  );
};

export default RouteCardList;
export type { RouteCardListProps };
