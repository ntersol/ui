import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

const scriptSrc = 'https://www.bing.com/api/maps/mapcontrol?key=';
const apiKey = 'AnTlR8QC4A9PDl4d0sLe5pfonbXmuPneJDVGS4jMi_CVxFcz4Q8RbxYJ25qlnY_p';
// Create factories for bing map entities to remove reliance on new keyword
const mapEntities = {
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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /** Any locations such as pushpins or circles */
  @Input() locations: Map.Location[];

  /** Configure the map options  */
  private _options: Map.Options;
  @Input()
  set options(options: Map.Options) {
    this._options = options;
  }
  get options() {
    return {
      ...this._options,
      pushPinsAddable: this.pushPinsAddable,
      pushPinIcon: this.pushPinIcon,
      pushPinRadius: this.pushPinRadius,
    };
  }

  /** Bing API key which can be generated @ https://www.bingmapsportal.com/Application. Defaults to low usage dev key */
  @Input() apiKey = apiKey;
  /** Default zoom level  */
  @Input() zoom = 9;
  /** Display a heatmap instead of pushpins  */
  @Input() heatmap = false;

  /** Can pushpins be added to the map. If so, one or many  */
  @Input() pushPinsAddable: false | 'single' | 'multiple' = false;
  /** URL of image to use for custom pin  */
  @Input() pushPinIcon: string;
  /** Draw a circle/radius around a push pin. Value is in miles */
  @Input() pushPinRadius: string;

  /** When any property of the viewport changes */
  @Output() viewChanged = new EventEmitter<Map.ViewProps>();
  /** When a location is added by clicking on the map */
  @Output() locationAdded = new EventEmitter<Microsoft.Maps.IPrimitive[]>();

  /** Reference to created bing map  */
  public map: Microsoft.Maps.Map;
  /** Reference to infobox instance  */
  public infoBox: Microsoft.Maps.Infobox;
  /** Reference to heatmap layer  */
  public heatMapLayer: Microsoft.Maps.HeatMapLayer;

  /** Map has been loaded  */
  public isLoaded = false;
  /** Randomly generated uniqueID for the div that holds the map. Allows for multiple map per page  */
  public uniqueId = 'map' + Math.floor(Math.random() * 1000000);
  /** Viewport properties  */
  private viewProps: Map.ViewProps = {};
  /** Hold references to map event handlers for future disposal  */

  private eventHandlers: { mapClicks?: Microsoft.Maps.IHandlerId } = {};
  /** Array of any created entities such as pushpins and circles   */
  private entities: Map.Entity[] = [];

  constructor() {}

  ngOnInit() {
    // Add a callback method on the global scope that bing maps can use to initialize the map after loading
    (<any>window).mapInitialize = () => this.mapInit();
  }

  ngOnChanges(model: any) {
    // console.log(model);
    // If map not loaded
    if (this.isLoaded && !this.map) {
      this.scriptsLoad();
    }

    // If map is loaded and present
    if (this.isLoaded && this.map) {
      // If new locations are passed down, update map
      if (model.locations) {
        this.mapInit();
      }

      // If an empty locations array or null locations is passed, clear out any preexisting entities
      // Or if new locations are passed down
      if (!model.locations || model.locations.length === 0 || (model.locations && model.locations.length)) {
        // this.locationsClear(this.map);
      }

      // If new push pin radius passed down
      if (model.pushPinRadius) {
        this.circlesRefresh(this.map, this.options);
      }
    } // End is loaded
  }

  ngAfterViewInit() {
    this.scriptsLoad();
  }

  /**
   * Check if Chart.js is loaded, if not, load it then initialize the chart in this component
   */
  public scriptsLoad() {
    if ((<any>window).Microsoft && (<any>window).Microsoft.Maps) {
      this.mapInit(); // Bing already loaded, init map
      this.isLoaded = true;
    } else {
      // Dynamically load bing js
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // Callback query param will fire after bing maps successfully loads
      script.src = scriptSrc + this.apiKey + '&callback=mapInitialize';
      script.onload = () => {
        // this.mapInit();
        this.isLoaded = true;
      }; // After load, init chart
      document.head.appendChild(script);
    }
  }

  /**
   * Create the map and set intial view and properties
   */
  private mapInit() {
    // If map is not present yet, create it
    if (!this.map) {
      // Create map reference
      this.map = mapEntities.map(this.uniqueId, { credentials: this.apiKey, ...this.options, zoom: this.zoom });
      // Attach infobox to map instance, on default is hidden
      this.infoBox = mapEntities.infoBox(this.map.getCenter(), { visible: false });
      this.infoBox.setMap(this.map);
      // When the view is changed such as scrolling or zooming
      Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', () => this.viewChange());
    }

    // Map instance was successfully created
    if (this.map) {
      // Set viewport properties
      this.viewProps = this.viewPropsUpdate(this.map);
      // If pushpins enabled
      if (this.options.pushPinsAddable) {
        // Remove previous click event handler
        if (this.eventHandlers.mapClicks) {
          // Microsoft.Maps.Events.removeHandler(this.eventHandlers.mapClicks);
        }
        // Add event handler to create pushpins
        this.eventHandlers.mapClicks = Microsoft.Maps.Events.addHandler(
          this.map,
          'click',
          (e: Microsoft.Maps.IMouseEventArgs) => {
            const entitiesNew = this.mapClickEvent(e, this.map, this.options);
            this.entities = [...this.entities, ...entitiesNew];
          },
        );
      }
      // Check if heatmap or pushpins
      if (this.heatmap) {
        // Load heatmap module
        Microsoft.Maps.loadModule('Microsoft.Maps.HeatMap', () => {
          // Clean up any previous instance of heatmap layer
          if (this.heatMapLayer) {
            this.heatMapLayer.dispose();
          }
          this.heatMapLayer = this.heatMap(this.map, this.locations);
        });
      } else {
        // If locations were passed down, add them after map creation
        this.locationsAdd(this.map, this.locations, this.options);
        // If multiple locations passed, adjust viewport to contain all. Else just center on single point
        if (this.locations && this.locations.length > 1) {
          // Resize viewport to fit all pins
          this.viewPortUpdate(this.map, this.locations);
        } else if (this.locations) {
          // Get only location and center viewport
          const element = <Microsoft.Maps.Pushpin>this.map.entities.get(0);
          this.map.setView({ center: element.getLocation() });
        }
      }
    } else {
      window.setTimeout(() => this.mapInit(), 500);
    }
  }

  /**
   * On a map click event, add a pushpin on the clicked location
   * @param e
   * @param map
   * @param type
   */
  private mapClickEvent(e: Microsoft.Maps.IMouseEventArgs, map: Microsoft.Maps.Map, options: Map.Options) {
    const entities: Map.Entity[] = [];

    // If pushpin type is set to single, clear out all other pins
    if (options.pushPinsAddable === 'single') {
      this.locationsClear(this.map);
    }
    // Options for pushpins
    const pinOptions: Microsoft.Maps.IPushpinOptions = {};
    // If custom icon specified
    if (options.pushPinIcon) {
      pinOptions.icon = options.pushPinIcon;
    }

    // Create new pushpin
    const pushpin = mapEntities.pushpin(e.location, pinOptions);
    map.entities.add(pushpin);
    entities.push({
      id: pushpin.entity.id,
      type: 'pushpin',
      ref: pushpin,
    });

    if (options.pushPinRadius) {
      const circle = this.circleDraw(map, e.location, options.pushPinRadius);
      entities.push({
        id: circle.entity.id,
        type: 'circle',
        ref: circle,
      });
    }
    return entities;
  }

  /**
   * When the view of the map changes such as scrolling or zooming
   * map: Microsoft.Maps.Map, viewPropsCurrent: Map.ViewProps, heatMapLayer: Microsoft.Maps.HeatMapLayer
   */
  private viewChange() {
    // Get the latest view properties
    let viewProps = this.viewPropsUpdate(this.map);

    // If the view change event was a zoom
    if (this.viewProps.zoom !== viewProps.zoom) {
      // If heatmap is present, throw away old layer and regenerate a new one
      if (this.heatMapLayer) {
        this.heatMapLayer.dispose();
        this.heatMapLayer = this.heatMap(this.map, this.locations);
      }
      // Update viewprops to indicate a zoom was performed
      viewProps = {
        ...viewProps,
        didZoom: true,
      };
    }

    // If the view change event was a scroll
    if (
      this.viewProps.center.latitude !== viewProps.center.latitude ||
      this.viewProps.center.longitude !== viewProps.center.longitude
    ) {
      // Update viewprops to indicate a scroll was performed
      viewProps = {
        ...viewProps,
        didScroll: true,
      };
    }

    // Now update viewProps
    this.viewProps = viewProps;

    // Emit
    this.viewChanged.emit(this.viewProps);
  }

  /**
   * Update the viewport properties such as zoom level, center position, etc
   * @param map
   */
  private viewPropsUpdate(map: Microsoft.Maps.Map) {
    const props: any = map.getBounds(); // getBounds not properly typed
    return <Map.ViewProps>{
      zoom: map.getZoom(),
      center: props.center,
      bounds: props.bounds,
    };
  }

  /**
   * Add locations such as pushpins and circles to the map
   * @param map
   * @param locations
   * @param options
   */
  private locationsAdd(map: Microsoft.Maps.Map, locations: Map.Location[], options?: Map.Options) {
    if (locations && locations.length) {
      // Create new pushpin instances and add to map
      const pins = locations.map(loc => {
        // Options for pushpins
        const pinOptions: Microsoft.Maps.IPushpinOptions = {};
        // If custom icon specified, default to pin specific icon otherwise fallback to global icon
        if (loc.icon || options.pushPinIcon) {
          pinOptions.icon = loc.icon || options.pushPinIcon;
        }
        const pin: Microsoft.Maps.Pushpin = mapEntities.pushpin(<any>loc, pinOptions);

        // If metadata available, add to pin and add infobox click event
        if (loc.metadata) {
          Microsoft.Maps.Events.addHandler(pin, 'click', this.pushpinClicked.bind(this));
          pin.metadata = { ...loc.metadata };
        }
        return pin;
      });
      map.entities.add(pins);
      return pins;
    }
  }

  /**
   * Creates a heatmap layer based on location entities
   * @param map
   * @param locations
   */
  private heatMap(map: Microsoft.Maps.Map, locations: Map.Location[]) {
    // Turn lat/long into location entities
    const locationsPoints = locations.map(loc => mapEntities.location(loc.latitude, loc.longitude));
    const zoom = map.getZoom();

    // Get a radius based on zoom level
    // TODO: Generate this programatically
    const radiuses = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      300,
      900,
      2000,
      3500,
      7000,
      10500,
      15500,
      30500,
      60000,
      90000,
      120000,
      120000,
      120000,
    ];
    const radius = radiuses[21 - zoom];

    // Get intensity based on zoom level
    // TODO: Generate this programatically
    let intensity = 0.75;
    if (21 - zoom > 14) {
      intensity = 0.05;
    } else if (21 - zoom > 13) {
      intensity = 0.2;
    } else if (21 - zoom > 11) {
      intensity = 0.5;
    }

    // Create heatmap layer
    const heatMap = mapEntities.heatMapLayer(locationsPoints, {
      intensity: intensity, // 0.5,
      radius: radius, // 10000
      unit: 'meters',
      /**
      colorGradient: {
          '0': 'Black',
          '0.4': 'Purple',
          '0.6': 'Red',
          '0.8': 'Yellow',
          '1': 'White'
      },
      aggregateLocationWeights: true
     */
    });
    map.layers.insert(heatMap);
    return heatMap;
  }

  /**
   * Resize the viewport to contain all the supplied locations
   * @param locations
   */
  private viewPortUpdate(map: Microsoft.Maps.Map, locations: Map.Location[]) {
    // Get the viewport dimensions
    const bestView = Microsoft.Maps.LocationRect.fromLocations(<any>locations);
    // Now resize
    map.setView({ bounds: bestView });
  }

  /** Clear entities such as pushpins and circles off the map */
  public locationsClear(map: Microsoft.Maps.Map) {
    map.entities.clear();
  }

  /**
   * When a pushpin is clicked, show the infobox
   * @param e
   */
  private pushpinClicked(e: any) {
    // Make sure the infobox has metadata to display.
    if (e.targetType === 'pushpin') {
      const pin: Microsoft.Maps.Pushpin = e.target;
      // Set the infobox options with the metadata of the pushpin.
      this.infoBox.setOptions({
        location: pin.getLocation(),
        /**
        htmlContent: 
        `<div class="infobox">
            <h3>Hello World</h3>
        </div>`,
         */
        title: pin.metadata.title,
        description: pin.metadata.description,
        visible: true,
      });
      // this.infoBox.setLocation(pin.getLocation());
    }
  }

  /**
   * Draw a circle around a point
   * @param origin
   * @param radius
   * @param disUnit
   */
  public circleDraw(map: Microsoft.Maps.Map, origin: any, radius: string, disUnit: string = 'mile') {
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
      locs.push(mapEntities.location(pLatitude, pLongitude));
    }

    // create the cirlce object
    const circle = mapEntities.polygon(locs, {
      visible: true,
      strokeThickness: 4,
      strokeColor: mapEntities.color(75, 0, 0, 255),
      fillColor: mapEntities.color(50, 0, 255, 0),
    });

    // Add to map
    map.entities.add(circle);
    // Return for collection
    return circle;
  }

  /**
   * Refresh the circles currently on the map
   * @param map
   * @param options
   * @param entities
   */
  private circlesRefresh(map: Microsoft.Maps.Map, options: Map.Options) {
    // Remove all circles from map
    this.entitiesGet<Microsoft.Maps.Polygon>(map, 'Polygon').forEach(entry => map.entities.remove(entry));

    // Get location of pushpin and add circle to map
    this.entitiesGet<Microsoft.Maps.Pushpin>(map, 'Pushpin').forEach(entity => {
      const location = entity.getLocation();
      this.circleDraw(map, location, options.pushPinRadius);
    });
  }

  /**
   * Extract a collection of entities from the map based on type. WIll be properly typed
   * @param map
   * @param type
   */
  private entitiesGet<t>(map: Microsoft.Maps.Map, type: 'Polygon' | 'Pushpin'): t[] {
    return <any>map.entities.getPrimitives().filter(entry => entry.entity.id.split('_')[0] === type);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.dispose();
    }
  }
}
