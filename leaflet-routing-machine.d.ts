declare module 'leaflet' {
  namespace Routing {
    interface LineOptions {
      styles: L.PathOptions[];
      extendToWaypoints: boolean;
      missingRouteTolerance: number;
    }

    interface ControlOptions {
      waypoints: L.LatLng[];
      routeWhileDragging?: boolean;
      lineOptions?: LineOptions;
      // Add other properties as needed
    }

    function control(options: ControlOptions): Control;
  }
} 