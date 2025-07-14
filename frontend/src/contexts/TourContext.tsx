import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface TourContextType {
  routeId: string | null;
  setRouteId: (id: string | null) => void;
  visitedWaypoints: string[];
  addVisitedWaypoint: (id: string) => void;
  resetVisited: () => void;
  userTrail: [number, number][];
  setUserTrail: React.Dispatch<React.SetStateAction<[number, number][]>>;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTourContext = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTourContext must be used within TourProvider");
  return ctx;
};

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [routeId, setRouteId] = useState<string | null>(null);
  const [visitedWaypoints, setVisitedWaypoints] = useState<string[]>([]);
  const [userTrail, setUserTrail] = useState<[number, number][]>([]);

  const addVisitedWaypoint = (id: string) => {
    setVisitedWaypoints((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const resetVisited = () => setVisitedWaypoints([]);

  return (
    <TourContext.Provider
      value={{ routeId, setRouteId, visitedWaypoints, addVisitedWaypoint, resetVisited, userTrail, setUserTrail }}
    >
      {children}
    </TourContext.Provider>
  );
};
