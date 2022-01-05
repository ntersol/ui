import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ViewEncapsulation,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, map, delay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { azureMapsStore, AzureMapsStore } from '../store/azure-maps.store';
import { NtsAzureMaps } from '../azure-maps.models';
import { Action } from '../store/azure-maps.actions';
import { Map, AuthenticationType } from 'azure-maps-control';
import { NtsAzureMapsService } from '../azure-maps.service';
import * as atlas from 'azure-maps-control';

@UntilDestroy()
@Component({
  selector: 'nts-azure-maps',
  templateUrl: './azure-maps.component.html',
  styleUrls: ['./azure-maps.component.scss'],
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsAzureMapsComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /** AzureMaps Api key */
  @Input() apiKey?: string;
  /** Randomly generated uniqueID for the div that holds the map. Allows for multiple map per page  */
  @Input() uniqueId = 'nts-azure-maps-' + Math.floor(Math.random() * 1000000);
  /** Store the map in memory instead of loading and unloading on demand */
  @Input() persistent = false;
  /** Map options */
  @Input() settings: NtsAzureMaps.Settings = {};
  /** URL of azuremaps js file */
  @Input() scriptSrc = 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js';
  /** Fit the map bounds to these inputs */
  @Input() cameraOptions?: NtsAzureMaps.CameraOptions;
  /** Any locations such as pushpins or circles */
  @Input() htmlMarkers: NtsAzureMaps.HtmlMarker[] = [];
  /** Set any markers currently displayed to their active state. Requires the string ID of the html marker above */
  @Input() htmlMarkersActive: string[] | null = null;
  /** Any layers */
  @Input() layers: NtsAzureMaps.Layer[] = [];
  /** Any datasources to attach or update to a source */
  @Input() dataSources: NtsAzureMaps.DataSource | NtsAzureMaps.DataSource[] = [];
  /** Resize/redraw the map. Necessary if the parent containers dimensions change */
  @Input() resize?: any;
  /** Map is disabled or enabled */
  @Input() disabled?: boolean;
  /** Emit layer interaction events */
  @Output() layerEvent = new EventEmitter<NtsAzureMaps.LayerEvent>();
  /** When a marker is clicked on */
  @Output() htmlMarkerClick = new EventEmitter<NtsAzureMaps.InteractionEvent>();
  /** When a marker is clicked on */
  @Output() htmlMarkerMouseEnter = new EventEmitter<NtsAzureMaps.InteractionEvent>();
  /** When a marker is clicked on */
  @Output() htmlMarkerDblclick = new EventEmitter<NtsAzureMaps.InteractionEvent>();
  /** When a popup is clicked */
  @Output() popupClick = new EventEmitter<NtsAzureMaps.InteractionEvent>();
  /** When a popup is closed */
  @Output() popupClose = new EventEmitter<NtsAzureMaps.InteractionEvent>();
  /** When a popup is closed */
  @Output() popupDblclick = new EventEmitter<NtsAzureMaps.InteractionEvent>();
  /** When map has loaded, passes store api */
  @Output() loaded = new EventEmitter<AzureMapsStore>();
  /** When a map zoom is completed */
  @Output() zoomend = new EventEmitter<any>();
  /** When a map drag is completed */
  @Output() dragend = new EventEmitter<any>();

  /** Is the browsers available, used for SSR/Angular universal */
  private isBrowser = isPlatformBrowser(this.platformId);

  /** Instantiate state management service */
  public store = azureMapsStore();

  /** Main state object, composed of options, config and computed props */
  public state$ = this.store.state$.pipe(
    untilDestroyed(this),
    filter(s => !!s.map),
    debounceTime(1),
  );

  /** Manage the smooth fading animation from the loader to the map */
  public loadMap$ = this.state$.pipe(
    map(s => !!s.map),
    filter(s => !!s),
    delay(300), // Needs 300ms delay to allow animation to complete
  );

  @ViewChild('mapContainer', { static: true, read: ElementRef }) mapContainer?: ElementRef<HTMLDivElement>;
  public mapRef?: NtsAzureMaps.MapRef | null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public svc: NtsAzureMapsService) { }

  ngOnInit() { }

  ngOnChanges(model: SimpleChanges) {
    // SSR check
    if (!this.isBrowser) {
      return;
    }

    // When locations are changed
    if (model.settings && this.settings) {
      this.store.stateChange(
        Action.settingsChange({
          ...this.settings,
          // Attach events to settings
          events: {
            marker: {
              click: this.htmlMarkerClick,
              dblclick: this.htmlMarkerDblclick,
              mouseenter: this.htmlMarkerMouseEnter,
            },
            popup: {
              click: this.popupClick,
              close: this.popupClose,
              dblclick: this.popupDblclick,
            },
          },
        }),
      );
    }

    // When camera options are specified
    if (model.cameraOptions && this.cameraOptions) {
      this.store.stateChange(Action.cameraOptions(this.cameraOptions));
    }

    // When resize is specified
    if (model.resize) {
      this.store.stateChange(Action.resize(true));
    }

    // When locations/markers are changed
    if (model.htmlMarkers && this.htmlMarkers) {
      // Attach event emitter for click event
      const htmlMarkers = this.htmlMarkers.map(m => ({
        ...m,
        events: {
          marker: { click: this.htmlMarkerClick, mouseenter: this.htmlMarkerMouseEnter },
          popup: { click: this.popupClick, close: this.popupClose },
        },
      }));
      this.store.stateChange(Action.markersAdd(htmlMarkers));
    }

    // When layers are changed
    if (model.layers && this.layers) {
      const layers = this.layers.map(m => ({ ...m, emitter: this.layerEvent }));
      this.store.stateChange(Action.layersChange(layers));
    }

    // When layers are changed
    if (model.htmlMarkersActive && this.htmlMarkersActive) {
      this.store.stateChange(Action.markersActiveAdd(this.htmlMarkersActive));
    }

    // When datasources are changed
    if (model.dataSources && this.dataSources) {
      const ds = this.dataSources && Array.isArray(this.dataSources) ? [...this.dataSources] : [this.dataSources];
      this.store.stateChange(Action.dataSourcesChange(ds));
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.scriptsLoad();
    }
  }

  /**
   * Check if map js is loaded, if not, load it then initialize the map in this component
   */
  public scriptsLoad() {
    if (atlas) {
      this.initialize(); // AzureMaps already loaded, init map
    } else {
      // Dynamically load atlas js
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // Callback query param will fire after azuremaps maps successfully loads
      script.src = this.scriptSrc;
      script.onload = () => this.initialize(); // After load, init chart
      document.head.appendChild(script);
    }
  }

  /**
   * Initialize the map
   */
  public initialize() {
    if (!this.apiKey || !this.settings || !this.isBrowser) {
      return;
    }

    /**
    const mapRef = this.svc.get(this.uniqueId);

    if (mapRef) {
      console.log(1);
      this.mapRef = mapRef;
      this.mapRef.map.resize();
      this.store.stateChange(Action.mapLoaded(this.mapRef.map));
      this.store.events.load$.next(true);
      this.loaded.emit(this.store);
      return;
    }

    this.mapRef = this.svc.create(this.uniqueId, this.apiKey, this.settings?.options);

    if (!this.mapRef || !this.mapContainer) {
      console.error('Error loading map');
      return;
    }

    this.mapContainer?.nativeElement.append(this.mapRef?.elem);
    console.log(2);
    const atlasMap = this.mapRef.map;

    atlasMap.resize();
     */
    /***/
    // Create map instance
    const atlasMap = new Map(this.uniqueId, {
      language: 'en-US',
      showLogo: false,
      showFeedbackLink: false,
      authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: this.apiKey,
      },
      style: 'road',
      zoom: 9,
      ...(this.settings?.options ?? {}),
    });


    // Construct a compass control and add it to the map.
    if (this.settings?.controls?.compass) {
      atlasMap.controls.add(new atlas.control.CompassControl(), this.settings.controls.compass);
    }

    // Construct a zoom control and add it to the map.
    if (this.settings?.controls?.zoom) {
      atlasMap.controls.add(new atlas.control.ZoomControl(), this.settings.controls.zoom);
    }

    // Click events
    atlasMap.events.add('click', () => {
      // Close any open popups if that setting is true
      if (this.settings.popup?.closeOn?.click && this.settings.popup.singleInstance && atlasMap.popups.getPopups().length) {
        // Close all popups
        const isPopupOpen = atlasMap.popups.getPopups().reduce((a, b) => (a ? a : b.isOpen()), false);
        if (isPopupOpen) {
          atlasMap.popups.getPopups().forEach(p => p.close());
        }
      }

      this.store.stateChange(Action.markersActiveAdd(null));
      // Set inactive state for any active markers
      const markers = atlasMap.markers.getMarkers();
      if (markers.length) {
        // Remove the active css class from all markers
        markers.forEach(m => {
          const elem = (m as any).element as HTMLDivElement;
          elem.classList.remove('marker-active');
        });
      }
    });

    // Construct a zoom control and add it to the map.
    if (this.settings?.controls?.style) {
      atlasMap.controls.add(new atlas.control.StyleControl(this.settings?.controls?.style), this.settings?.controls?.style);
    }

    // When the map has loaded and is ready
    atlasMap.events.addOnce('ready', e => {
      this.store.stateChange(Action.mapLoaded(atlasMap));
      this.store.events.load$.next(e);
      this.loaded.emit(this.store);
    });
    // Zoom end event
    atlasMap.events.add('zoomend', e => {
      const zoom = e.map.getCamera().zoom;
      if (zoom) {
        this.store.stateChange(Action.zoomChange(zoom));
      }
      this.zoomend.emit(e);
    });
    atlasMap.events.add('dragend', e => this.dragend.emit(e));
  }

  ngOnDestroy() {
    this.store.stateChange(Action.destroy());
  }
}
