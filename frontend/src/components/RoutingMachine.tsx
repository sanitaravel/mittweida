import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import type { ControlOptions } from "leaflet";
import "leaflet-routing-machine";
import { getColorValue } from "../utils/routeUtils";

interface RoutingMachineProps extends ControlOptions {
  waypoints: L.LatLng[];
  color?: string;
  routeWhileDragging?: boolean;
  addWaypoints?: boolean;
  show?: boolean;
}

const createRoutingMachineLayer = (props: RoutingMachineProps) => {
  const {
    waypoints,
    color = "blue",
    routeWhileDragging = false,
    addWaypoints = false,
  } = props;

  const instance = (L as any).Routing.control({
    waypoints: waypoints,
    routeWhileDragging,
    addWaypoints,
    createMarker: function (i: number, waypoint: any) {
      // Create a custom numbered marker
      const marker = L.marker(waypoint.latLng, {
        icon: L.divIcon({
          className: "numbered-waypoint-marker",
          html: `<div class="waypoint-number">${i + 1}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      });
      return marker;
    },
    router: (L as any).Routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1",
      profile: "foot", // Use walking/pedestrian routing
    }),
    lineOptions: {
      styles: [
        {
          color: getColorValue(color),
          weight: 4,
          opacity: 0.7,
        },
      ],
    },
  });

  // Hide the control container
  instance.on("add", function () {
    const container = instance.getContainer();
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;
