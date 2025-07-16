import { render, screen, fireEvent } from "@testing-library/react";
import Map from "../Map";
import React from "react";
import { vi } from "vitest";

// Mock react-leaflet and leaflet for shallow rendering
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children, ...props }: any) => {
    // Find the MapController child and call its onMapInstanceReady with a mock map
    let mapInstance = {
      fitBounds: () => {},
      zoomIn: () => {},
      zoomOut: () => {},
    };
    React.Children.forEach(children, (child: any) => {
      if (child && child.props && typeof child.props.onMapInstanceReady === "function") {
        child.props.onMapInstanceReady(mapInstance);
      }
    });
    return <div data-testid="map-container">{children}</div>;
  },
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children, ...props }: any) => (
    <div data-testid="marker" {...props}>
      {children}
    </div>
  ),
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  useMapEvents: () => ({}),
}));
vi.mock('leaflet', () => {
  class LatLng {
    lat: number;
    lng: number;
    constructor(lat: number, lng: number) {
      this.lat = lat;
      this.lng = lng;
    }
  }
  const leafletMock = {
    latLng: (lat: number, lng: number) => new LatLng(lat, lng),
    latLngBounds: () => ({ extend: () => {}, isValid: () => true }),
    Icon: { Default: { prototype: {}, mergeOptions: () => {} } },
    LatLng,
  };
  return {
    ...leafletMock,
    default: leafletMock,
  };
});
vi.mock("../RoutingMachine", () => ({
  __esModule: true,
  default: () => <div data-testid="routing-machine" />,
}));

const mockRoutes = [
  {
    id: "1",
    name: "Route 1",
    stops: 2,
    features: [],
    color: "blue",
    places: [
      {
        id: "p1",
        name: "Place 1",
        description: "",
        coordinates: [50.98, 12.97] as [number, number],
        type: "attraction",
        estimatedVisitTime: 30,
      },
      {
        id: "p2",
        name: "Place 2",
        description: "",
        coordinates: [50.99, 12.98] as [number, number],
        type: "museum",
        estimatedVisitTime: 45,
      },
    ],
    description: "Test route",
  },
];

describe("Map", () => {
  it("renders map container and markers", () => {
    render(<Map routes={mockRoutes} showRoutePaths={true} />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByTestId("marker").length).toBeGreaterThan(0);
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
    expect(screen.getByTestId("routing-machine")).toBeInTheDocument();
  });

  it("shows attribution popup when info button is clicked", () => {
    render(<Map routes={mockRoutes} />);
    const infoButton = screen.getByTitle("Map Information");
    fireEvent.click(infoButton);
    expect(screen.getByText(/Stadia Maps/)).toBeInTheDocument();
    // Close popup
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByText(/Stadia Maps/)).not.toBeInTheDocument();
  });
});
