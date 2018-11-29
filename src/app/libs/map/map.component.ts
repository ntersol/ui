import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewChecked,
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
export class MapComponent implements OnInit, AfterViewChecked, OnChanges, OnDestroy {

  /** Any entities such as pushpins or circles */
  @Input() entities: Location[];
  /** Configure the map  */
  @Input() options: Microsoft.Maps.IMapOptions = {};
  /** Bing API key which can be generated @ https://www.bingmapsportal.com/Application. Defaults to low usage dev key */
  @Input() apiKey = apiKey;
  /** Default zoom level  */
  @Input() zoom = 9;
  /** Display a heatmap instead of pushpins  */
  @Input() heatmap = false;

  /** When entities are updated, they are emitted from here */
  @Output() entitiesUpdated = new EventEmitter<Microsoft.Maps.IPrimitive[]>();

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
  /** Current zoom level  */
  private zoomLevel: number;

  constructor() {}

  ngOnInit() {
  }

  ngOnChanges() {
    // If changed
    if (this.isLoaded && !this.map) {
      this.scriptsLoad();
    }

    // If new entities are passed down, clear out existing and add to map
    if (this.isLoaded && this.map && this.entities && !this.isEmitting) {
      this.entitiesClear();
      this.entitiesAdd(this.map, this.entities);
      const element = <Microsoft.Maps.Pushpin>this.map.entities.get(0);
      this.map.setView({ center: element.getLocation() });
    }

    // Clear out any preexisting entities
    if (this.isLoaded && this.map && !this.isEmitting && (!this.entities || this.entities.length === 0)) {
      this.entitiesClear();
    }

    this.isEmitting = false;
  }

  ngAfterViewChecked() {
    this.scriptsLoad();
  }

  /**
   * Check if Chart.js is loaded, if not, load it then initialize the chart in this component
   */
  public scriptsLoad() {
    if ((<any>window).Microsoft && (<any>window).Microsoft.Maps) {
      this.mapInit(); // Chart.js already loaded, init chart
      this.isLoaded = true;
    } else {
      // Dynamically load map module
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptSrc + this.apiKey + '&callback=mapInit';
      script.onload = () => {
        this.mapInit();
        this.isLoaded = true;
      }; // After load, init chart
      document.head.appendChild(script);
    }
  }

  /**
   * Create the map and set intial view and properties
   */
  public mapInit() {
    // Get reference to map
    const map = document.getElementById(this.uniqueId);
    if (map && !this.map) {
      // Bing can't see the DOM sometimes on initial load even when in the right lifecycle hook
      try {
        // Store map reference
        this.map = new Microsoft.Maps.Map(map, { credentials: this.apiKey, ...this.options, zoom: this.zoom });
        // Update zoom property
        this.zoomLevel = this.map.getZoom();

        // Attach infobox to map instance, on default is hidden
        this.infoBox = new Microsoft.Maps.Infobox(this.map.getCenter(), {visible: false });
        this.infoBox.setMap(this.map);

        // On view change
        Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', () => {
          // If heatmap specified and the zoom level changed
          if (this.heatMap && this.heatMapLayer && this.zoomLevel !== this.map.getZoom()) {
            this.heatMapLayer.dispose();
            this.heatMapLayer = this.heatMap(this.map, this.entities);
          }
          // Update zoom property
          this.zoomLevel = this.map.getZoom();
        });

        /** */
       if (this.heatmap) {
        Microsoft.Maps.loadModule('Microsoft.Maps.HeatMap', () => {
          this.heatMapLayer = this.heatMap(this.map, this.entities);
        });
       } else {
          // If entities were passed down, add them after map creation
          this.entitiesAdd(this.map, this.entities);
          // Resize viewport to fit all pins
          this.viewPortUpdate(this.map, this.entities);
       }

        /**
        // Add click event handler
        Microsoft.Maps.Events.addHandler(this.map, 'click', (e: any) => {
          // console.log(e);
          // Add info box
          // var center = this.map.getCenter();
          // var infobox = new Microsoft.Maps.Infobox(e.location, {
          //  title: 'New Pin',
          //  // description: 'Seattle'
          // });
          // infobox.setMap(this.map);

          // Remove pushpins
          this.entitiesClear();

          // Add pushpin
          const pushpin = new Microsoft.Maps.Pushpin(e.location);
          console.log(e.location);
          console.log(pushpin);
          //  { icon: 'https://www.bingmapsportal.com/Content/images/poi_custom.png' }
          this.map.entities.push(pushpin);

          // Add circle
          const circle = this.drawCircle(e.location, '1', 'mile');
          this.map.entities.push(circle);

          // Pass entities list for parent
          this.isEmitting = true;
          this.entitiesUpdated.emit(this.map.entities.getPrimitives());
        });
      */
      } catch (err) {
        window.setTimeout(() => this.mapInit(), 50);
      }
    } else {
      window.setTimeout(() => this.mapInit(), 50);
    }
  }

  /** Add entities such as pushpins and circles to the map */
  public entitiesAdd(map: Microsoft.Maps.Map, locations: Location[]) {
    if (locations && locations.length) {
      // Create new pushpin instances and add to map
      const pins = locations.map(loc => {
        const pin: Microsoft.Maps.Pushpin = new Microsoft.Maps.Pushpin((<any>loc));
        Microsoft.Maps.Events.addHandler(pin, 'click', this.pushpinClicked.bind(this));
        // Add metadata if available
        if (loc.metadata) {
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
  public heatMap(map: Microsoft.Maps.Map, locations: Location[]) {
    // Turn lat/long into location entities
    const locationsPoints = locations.map(loc => new Microsoft.Maps.Location(loc.latitude, loc.longitude));
    const zoom = map.getZoom();
   
    // Get a radius based on zoom level
    // TODO: Generate this programatically
    const radiuses = [0, 0, 0, 0, 0, 0, 0, 0, 300, 900, 2000, 3500, 7000, 
      10500, 15500, 30500, 60000, 90000, 120000, 120000, 120000];
    const radius = radiuses[21 - zoom];
    
    // Get intensity based on zoom level
    // TODO: Generate this programatically
    let intensity = .75;
    if ((21 - zoom) > 14) {
      intensity = .05;
    } else if ((21 - zoom) > 13) {
      intensity = .2;
    } else if ((21 - zoom) > 11) {
      intensity = .5;
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
  public viewPortUpdate(map: Microsoft.Maps.Map, locations: Location[]) {
    // Get the viewport dimensions
    const bestView = Microsoft.Maps.LocationRect.fromLocations(<any>locations);
    // Now resize
    map.setView({bounds: bestView });
  }

  /** Clear entities such as pushpins and circles off the map */
  public entitiesClear() {
    this.map.entities.clear();
  }


  public pushpinClicked(e: any) {
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
        visible: true
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
