// Create factories for bing map entities to remove tight coupling to 'new' keyword
export const MapObjectTypes = {
  map: (divId: string, options?: Microsoft.Maps.IMapLoadOptions) =>
    new Microsoft.Maps.Map(document.getElementById(divId), options),
  infoBox: (location: Microsoft.Maps.Location, options?: Microsoft.Maps.IInfoboxOptions) =>
    new Microsoft.Maps.Infobox(location, options),
  pushpin: (location: Microsoft.Maps.Location, options?: Microsoft.Maps.IPushpinOptions) =>
    new Microsoft.Maps.Pushpin(location, options),
  location: (latitude: number, longitude: number) => new Microsoft.Maps.Location(latitude, longitude),
  heatMapLayer: (
    locations: (Microsoft.Maps.Location | Microsoft.Maps.Pushpin)[],
    options: Microsoft.Maps.IHeatMapLayerOptions,
  ) => new Microsoft.Maps.HeatMapLayer(locations, options),
  polygon: (rings: Microsoft.Maps.Location[] | Microsoft.Maps.Location[][], options: Microsoft.Maps.IPolygonOptions) =>
    new Microsoft.Maps.Polygon(rings, options),
  color: (a: number, b: number, c: number, d: number) => new Microsoft.Maps.Color(a, b, c, d),
};

export const MapObjects = {
  /**
   * Add locations such as pushpins and circles to the map
   * @param map
   * @param locations
   * @param options
   */
  pushPinAdd: (
    map: Microsoft.Maps.Map,
    locations: Map.Location[],
    options: Map.Options,
  ) => {
    if (locations && locations.length) {
      // Create new pushpin instances and add to map
      const pins = locations.map(loc => {
        // Options for pushpins
        const pinOptions: Microsoft.Maps.IPushpinOptions = {};
        // If custom icon specified, default to pin specific icon otherwise fallback to global icon
        if (loc.icon || options.pushPinIcon) {
          pinOptions.icon = loc.icon || options.pushPinIcon;
        }
        const pin: Microsoft.Maps.Pushpin = MapObjectTypes.pushpin(<any>loc, pinOptions);
        if (loc.metadata) {
          pin.metadata = { ...pin.metadata };
        }
        return pin;
      });
      map.entities.add(pins);
      return pins;
    }
  },

  /** Clear entities such as pushpins and circles off the map */
  removeAll: (map: Microsoft.Maps.Map) => {
    map.entities.clear();
  },

  /**
   * Draw a circle around a point
   * @param origin
   * @param radius
   * @param disUnit
   */
  circleDraw: (map: Microsoft.Maps.Map, origin: any, radius: string, disUnit: string = 'mile') => {
    let RadPerDeg = 0;
    let earthRadius = 0;

    RadPerDeg = Math.PI / 180;

    // get the earth radius based on unit
    disUnit.toLowerCase() === 'mile' ? (earthRadius = 3959) : (earthRadius = 6371);

    const lat = origin.latitude * RadPerDeg;
    const lon = origin.longitude * RadPerDeg;
    const locs = [];
    const AngDist = parseFloat(radius) / earthRadius;
    for (let x = 0; x <= 360; x++) {
      // making a 360-sided polygon
      let pLatitude, pLongitude;
      const brng = x * RadPerDeg;
      pLatitude = Math.asin(Math.sin(lat) * Math.cos(AngDist) + Math.cos(lat) * Math.sin(AngDist) * Math.cos(brng)); // still in radians
      pLongitude =
        lon +
        Math.atan2(
          Math.sin(brng) * Math.sin(AngDist) * Math.cos(lat),
          Math.cos(AngDist) - Math.sin(lat) * Math.sin(pLatitude),
        );
      pLatitude = pLatitude / RadPerDeg;
      pLongitude = pLongitude / RadPerDeg;
      locs.push(MapObjectTypes.location(pLatitude, pLongitude));
    }

    // create the cirlce object
    const circle = MapObjectTypes.polygon(locs, {
      visible: true,
      strokeThickness: 4,
      strokeColor: MapObjectTypes.color(75, 0, 0, 255),
      fillColor: MapObjectTypes.color(50, 0, 255, 0),
    });

    // Add to map
    map.entities.add(circle);
    // Return for collection
    return circle;
  },

  /**
   * Refresh the circles currently on the map
   * @param map
   * @param options
   * @param entities
   */
  circlesRefresh: (map: Microsoft.Maps.Map, options: Map.Options) => {
    // Remove all circles from map
    MapObjects.entitiesGet<Microsoft.Maps.Polygon>(map, 'Polygon').forEach(entry => map.entities.remove(entry));

    // Get location of pushpin and add circle to map
    MapObjects.entitiesGet<Microsoft.Maps.Pushpin>(map, 'Pushpin').forEach(entity => {
      const location = entity.getLocation();
      console.log(location);
      MapObjects.circleDraw(map, location, options.pushPinRadius);
    });
  },

  /**
   * Extract a collection of entities from the map based on type. WIll be properly typed
   * @param map
   * @param type
   */
  entitiesGet: <t>(map: Microsoft.Maps.Map, type: 'Polygon' | 'Pushpin'): t[] => {
    return <any>map.entities.getPrimitives().filter(entry => entry.entity.id.split('_')[0] === type);
  },
};
