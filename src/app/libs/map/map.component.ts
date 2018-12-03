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

// import { MapObjectsService } from './services/map-objects.service';

import { MapObjects, MapObjectTypes } from './factories/map.objects';
import { MapView } from './factories/map.view';
import { MapEvents } from './factories/map.events';

const scriptSrc = 'https://www.bing.com/api/maps/mapcontrol?key=';
const apiKey = 'AnTlR8QC4A9PDl4d0sLe5pfonbXmuPneJDVGS4jMi_CVxFcz4Q8RbxYJ25qlnY_p';


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
  @Output() addedPushPin = new EventEmitter<Microsoft.Maps.Location[]>();

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

  constructor() {}

  ngOnInit() {
    // Add a callback method on the global scope that bing maps can use to initialize the map after loading
    (<any>window).mapInitialize = () => this.mapInit();
  }

  ngOnChanges(model: any) {
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
      // !model.locations || model.locations.length === 0 || 
      if (model.locations && model.locations.length) {
        MapObjects.removeAll(this.map);
      }

      // If new push pin radius passed down
      if (model.pushPinRadius) {
        MapObjects.circlesRefresh(this.map, this.options);
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
      this.map = MapObjectTypes.map(this.uniqueId, { credentials: this.apiKey, ...this.options, zoom: this.zoom });
      // Attach infobox to map instance, on default is hidden
      this.infoBox = MapObjectTypes.infoBox(this.map.getCenter(), { visible: false });
      this.infoBox.setMap(this.map);
      // When the view is changed such as scrolling or zooming
      Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', () => this.viewChange());
    }

    // Map instance was successfully created
    if (this.map) {
      // Set viewport properties
      this.viewProps = MapView.viewPropsUpdate(this.map);
      // If pushpins enabled
      if (this.options.pushPinsAddable) {
        // Remove previous click event handler
        if (this.eventHandlers.mapClicks) {
          Microsoft.Maps.Events.removeHandler(this.eventHandlers.mapClicks);
        }
        // Add event handler to create pushpins
        this.eventHandlers.mapClicks = Microsoft.Maps.Events.addHandler(
          this.map,
          'click',
          (e: Microsoft.Maps.IMouseEventArgs) => {
            // Emit newly added location
            const pins = MapEvents.mapClickEvent(e, this.map, this.options);
            // Emit the locations of the newly created pins
            this.addedPushPin.emit(pins.map(pin => pin.getLocation()));
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
        const pins = MapObjects.pushPinAdd(this.map, this.locations, this.options);
        // If metadata available, add to pin and add infobox click event
        pins.forEach(pin => {
          if (pin.metadata) {
            Microsoft.Maps.Events.addHandler(pin, 'click', (e: Microsoft.Maps.IMouseEventArgs) => {
              this.infoBox.setOptions(MapEvents.pushpinClicked(e));
            });
          }
        });
        // If multiple locations passed, adjust viewport to contain all. Else just center on single point
        if (this.locations && this.locations.length > 1) {
          // Resize viewport to fit all pins
          MapView.viewPortUpdate(this.map, this.locations);
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
   * When the view of the map changes such as scrolling or zooming
   * map: Microsoft.Maps.Map, viewPropsCurrent: Map.ViewProps, heatMapLayer: Microsoft.Maps.HeatMapLayer
   */
  private viewChange() {
    // Get the latest view properties
    let viewProps = MapView.viewPropsUpdate(this.map);

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
   * Creates a heatmap layer based on location entities
   * @param map
   * @param locations
   */
  private heatMap(map: Microsoft.Maps.Map, locations: Map.Location[]) {
    // Turn lat/long into location entities
    const locationsPoints = locations.map(loc => MapObjectTypes.location(loc.latitude, loc.longitude));
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
    const heatMap = MapObjectTypes.heatMapLayer(locationsPoints, {
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

  ngOnDestroy() {
    if (this.map) {
      this.map.dispose();
    }
  }
}
