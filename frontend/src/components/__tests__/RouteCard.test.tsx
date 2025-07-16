import { render, screen, fireEvent } from "@testing-library/react";
import RouteCard from "../RouteCard";
import type { Route } from "../RouteCard";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { vi } from "vitest";

// Mock translation hook
vi.mock("../../hooks/useTranslation", () => ({
  useTranslation: () => ({ t: (x: string) => x }),
}));

vi.mock("../../utils/routeUtils", () => {
  const actual = vi.importActual<typeof import("../../utils/routeUtils")>(
    "../../utils/routeUtils"
  );
  return {
    ...actual,
    getColorClass: () => "bg-mock",
    getColorValue: () => "#123456",
    formatDuration: () => "1h 30m",
    calculateRouteDuration: () => 90,
    getRoutingTimeFromCache: () => 10,
  };
});

describe("RouteCard", () => {
  const mockRoute: Route = {
    id: "1",
    name: "Test Route",
    stops: 3,
    features: [
      { key: "f1", name: "Feature 1" },
      { key: "f2", name: "Feature 2" },
    ],
    color: "blue",
    places: [],
    description: "A test route",
  };

  it("renders route name and features", () => {
    render(
      <SettingsProvider>
        <RouteCard route={mockRoute} isSelected={false} onSelect={() => {}} />
      </SettingsProvider>
    );
    expect(screen.getByText("Test Route")).toBeInTheDocument();
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("1h 30m")).toBeInTheDocument();
    expect(screen.getByText("3 stops")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(
      <SettingsProvider>
        <RouteCard route={mockRoute} isSelected={false} onSelect={onSelect} />
      </SettingsProvider>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith("1");
  });
});
