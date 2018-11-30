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


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /** Any entities such as pushpins or circles */
  @Input() locations: Map.Location[];
  /** Configure the map  */
  @Input() options: Microsoft.Maps.IMapOptions = {};
  /** Bing API key which can be generated @ https://www.bingmapsportal.com/Application. Defaults to low usage dev key */
  @Input() apiKey = apiKey;
  /** Default zoom level  */
  @Input() zoom = 9;
  /** Display a heatmap instead of pushpins  */
  @Input() heatmap = false;
  /** Display a heatmap instead of pushpins  */
  @Input() addPushPins: false | 'single' | 'multiple' = false;

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
  /** Disable updating immediately after entities has been emitted. This prevents update loop */
  private isEmitting = false;
  /** Viewport properties  */
  private viewProps: Map.ViewProps = {};
 
  constructor() {}

  ngOnInit() { 
    // Add a callback method on the global scope that bing maps can use to initialize the map after loading
    (<any>window).mapInitialize = () => this.mapInit();
  }

  ngOnChanges() {
    // If changed
    if (this.isLoaded && !this.map) {
      this.scriptsLoad();
    }

    // If new locations are passed down, clear out existing and update map
    if (this.isLoaded && this.map && this.locations && !this.isEmitting) {
      console.log('test');
      this.mapSetType();
    }

    // If an empty locations array or null locations is passed, clear out any preexisting entities
    if (this.isLoaded && this.map && !this.isEmitting && (!this.locations || this.locations.length === 0)) {
      this.locationsClear(this.map);
    }

    this.isEmitting = false;
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
     // Bing can't see the DOM sometimes on initial load even when in the right lifecycle hook
     // try {
        // Create map reference
        this.map = new Microsoft.Maps.Map(
          document.getElementById(this.uniqueId), 
          { credentials: this.apiKey, ...this.options, zoom: this.zoom }
          );
    // } catch (err) {}
    
    // Map instance was successfully created
    if (this.map) {
        // Set viewport properties
        this.viewProps = this.viewPropsUpdate(this.map);

        // Attach infobox to map instance, on default is hidden
        this.infoBox = new Microsoft.Maps.Infobox(this.map.getCenter(), { visible: false });
        this.infoBox.setMap(this.map);
        // When the view is changed such as scrolling or zooming
        Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', () => this.viewChange());

        // If pushpins enabled, add event handler
        if (this.addPushPins) {
          Microsoft.Maps.Events.addHandler(this.map,
            'click',
            (e: Microsoft.Maps.IMouseEventArgs) => this.mapClickEvent(e, this.map, this.addPushPins)
          );
        }
        // Now set map type, either heatmap or pushpins
        this.mapSetType();

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
  private mapClickEvent(e: Microsoft.Maps.IMouseEventArgs, map: Microsoft.Maps.Map, type: false | 'single' | 'multiple') {
    console.log(e);
    // If pushpin type is set to single, clear out all other pins
    if (type === 'single') {
      this.locationsClear(this.map);
    }
    const pushpin = new Microsoft.Maps.Pushpin(e.location);
    //  { icon: 'https://www.bingmapsportal.com/Content/images/poi_custom.png' }
    // Add circle
    // const circle = this.drawCircle(e.location, '1', 'mile');
    // this.map.entities.push(circle);
    map.entities.push(pushpin);
  }

  /**
   * Determine which type of map to create, heatmap or pushpin based
   */
  private mapSetType() {
    // Check if heatmap or pushpins
    if (this.heatmap) {
      // Load heatmap module
      Microsoft.Maps.loadModule('Microsoft.Maps.HeatMap', () => {
        this.heatMapLayer = this.heatMap(this.map, this.locations);
      });
    } else {
      // Clear out any old locations
      this.locationsClear(this.map);
      // If locations were passed down, add them after map creation
      this.locationsAdd(this.map, this.locations);
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
  }

  

  /**
   * When the view of the map changes such as scrolling or zooming
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
        didZoom: true
      };
    }

    // If the view change event was a scroll
    if (this.viewProps.center.latitude !== viewProps.center.latitude || 
      this.viewProps.center.longitude !== viewProps.center.longitude) {
      // Update viewprops to indicate a scroll was performed
      viewProps = {
        ...viewProps,
        didScroll: true
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
      bounds: props.bounds
    };
  }

  /** Add locations such as pushpins and circles to the map */
  private locationsAdd(map: Microsoft.Maps.Map, locations: Map.Location[]) {
    if (locations && locations.length) {
      // Create new pushpin instances and add to map
      const pins = locations.map(loc => {
        const pin: Microsoft.Maps.Pushpin = new Microsoft.Maps.Pushpin(<any>loc);
        // If metadata available, add to pin and add infobox click event
        if (loc.metadata) {
          Microsoft.Maps.Events.addHandler(pin, 'click', this.pushpinClicked.bind(this));
          pin.metadata = { ...loc.metadata };
        }
        return pin;
      });
      map.entities.push(pins);
    }
  }

  /**
   * Creates a heatmap layer based on location entities
   * @param map
   * @param locations
   */
  private heatMap(map: Microsoft.Maps.Map, locations: Map.Location[]) {
    // Turn lat/long into location entities
    const locationsPoints = locations.map(loc => new Microsoft.Maps.Location(loc.latitude, loc.longitude));
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
    const heatMap = new Microsoft.Maps.HeatMapLayer(locationsPoints, {
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
  public drawCircle(origin: any, radius: string, disUnit: string) {
    let RadPerDeg = 0;
    let earthRadius = 0;

    RadPerDeg = Math.PI / 180;

    // get the earth radius based on unit
    disUnit.toLowerCase() === 'mile' ? (earthRadius = 3959) : (earthRadius = 6371);

    const lat = origin.latitude * RadPerDeg;
    const lon = origin.longitude * RadPerDeg;
    const locs = new Array();
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
      locs.push(new Microsoft.Maps.Location(pLatitude, pLongitude));
    }

    // create the cirlce object
    return new Microsoft.Maps.Polygon(locs, {
      visible: true,
      strokeThickness: 4,
      strokeColor: new Microsoft.Maps.Color(75, 0, 0, 255),
      fillColor: new Microsoft.Maps.Color(50, 0, 255, 0),
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.dispose();
    }
  }
}
