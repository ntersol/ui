export const MapView = {
  /**
   *
   * @param map
   * @param locations
   */
  viewPortUpdate: (map: Microsoft.Maps.Map, locations: Map.Location[]) => {
    // Get the viewport dimensions
    const bestView = Microsoft.Maps.LocationRect.fromLocations(<any>locations);
    // Now resize
    map.setView({ bounds: bestView });
  },
  /**
   *
   * @param map
   */
  viewPropsUpdate: (map: Microsoft.Maps.Map) => {
    const props: any = map.getBounds(); // getBounds not properly typed
    return <Map.ViewProps>{
      zoom: map.getZoom(),
      center: props.center,
      bounds: props.bounds,
    };
  },
};
