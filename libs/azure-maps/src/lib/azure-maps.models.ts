import { EventEmitter } from '@angular/core';
import * as atlas from 'azure-maps-control';
import { data, TargetedEvent } from 'azure-maps-control';
import { Map } from 'azure-maps-control';

export module NtsAzureMaps {
  export type Options = atlas.ServiceOptions &
    atlas.StyleOptions &
    atlas.UserInteractionOptions &
    (atlas.CameraOptions | atlas.CameraBoundsOptions);

  /** Map options supplied by the parent configuration */
  export interface Settings {
    /** Map options */
    options?: Options;
    /** If true, will store all map references in memory. Increase performance but does not free up memory */
    // persistent?: boolean;
    /** Path to an image to use as a background while the map is loading */
    placeholder?: string | null;
    /** Switch to clustering when over this zoom level */
    // clusterAt?: number | null;
    /** Show/hide the heatmap in lieu of the markers */
    // heatmapEnable?: boolean | null;
    zoom?: number;
    /** Do not allow zooming below this level */
    zoomMin?: number;
    /** Do not allow zooming above this level */
    zoomMax?: number;
    /** Global map pin settings, can be overwritten on a pin level */
    marker?: {
      global?: {
        htmlContent?: Marker2String;
        options?: atlas.HtmlMarkerOptions;
      };
    };
    popup?: {
      /** If true, only a single popup can be open */
      singleInstance?: boolean;
      global?: {
        content?: Marker2String;
        options?: atlas.PopupOptions;
      };
      /** Close the open popup on the following events */
      closeOn?: {
        /** When clicking on the map outside of the popup */
        click?: boolean;
        // mapMove?: boolean; Not added yet
      };
    };
    /** Global popup settings, can be overwritten on a pin level */
    // popup?: Popup | null;
    /** Prevent panning from outside this area, [[west, south], [east, north]] */
    maxBounds?: any;
    /** Show/hide default map controls */
    controls?: {
      options?: {
        /** Disable all controls */
        disabled?: boolean;
      };
      zoom?: ControlOptions | null;
      compass?: ControlOptions | null;
      style?: ControlOptions | null;
    };
    /** Hide the markers, use to show/hide in conjunction with other layers */
    markersHide?: boolean;
    events?: {
      marker?: {
        click?: EventEmitter<NtsAzureMaps.InteractionEvent>;
        dblclick?: EventEmitter<NtsAzureMaps.InteractionEvent>;
        mouseenter?: EventEmitter<NtsAzureMaps.InteractionEvent>;
      };
      popup?: {
        click?: EventEmitter<NtsAzureMaps.InteractionEvent>;
        dblclick?: EventEmitter<NtsAzureMaps.InteractionEvent>;
        close?: EventEmitter<NtsAzureMaps.InteractionEvent>;
      };
    };
  }

  export interface MapRef {
    elem: HTMLDivElement; 
    map: Map;
  }

  export interface ControlOptions extends atlas.ControlOptions {
    disabled?: boolean;
  }

  /**
   * Layer types
   */
  export type Layer = PolygonLayer | TileLayer | LineLayer | BubbleLayer | SymbolLayer | HtmlMarkerLayer;

  export type temp = Record<MouseEventType, boolean>;

  export interface HtmlMarkerLayer extends LayerSrc {
    type: 'HtmlMarkerLayer';
    sourceId: string;
    /** The property of the unique ID. Used to track deltas on datasource changes */
    uniqueID: string;
    config?: {
      updateOn?: {
        [key in MapEventType]?: boolean;
      };
    };
    options: atlas.BubbleLayerOptions;
  }

  export interface PolygonLayer extends LayerSrc {
    type: 'Polygon';
    sourceId: string;
    options: atlas.PolygonLayerOptions;
  }

  export interface TileLayer extends LayerSrc {
    type: 'TileLayer';
    tileUrl?: () => string;
    options: atlas.TileLayerOptions;
  }

  export interface BubbleLayer extends LayerSrc {
    type: 'Bubble';
    sourceId: string;
    options: atlas.BubbleLayerOptions;
    config?: {
      zoomOnClick?: boolean;
    };
  }

  export interface SymbolLayer extends LayerSrc {
    type: 'Symbol';
    sourceId: string;
    options: atlas.SymbolLayerOptions;
  }

  export interface LineLayer extends LayerSrc {
    type: 'Line';
    sourceId: string;
    options: atlas.LineLayerOptions;
  }

  interface LayerSrc {
    type: string;
    sourceId?: string;
    id: string;
    options: any;
    /** Specify a layer or layer id to insert the new layer(s) before it */
    before?: string;
    /** Emit the following events to the parent component */
    events?: MouseEventType[];
    emitter?: EventEmitter<LayerEvent>; // TODO: Create new private model
  }

  export interface LayerEvent {
    event: atlas.MapMouseEvent; //  | atlas.TargetedEvent
    eventType: MouseEventType;
    layerId: string;
    shape: atlas.Shape;
  }

  export interface InteractionEvent<t = any> {
    entity: atlas.Popup | atlas.HtmlMarker;
    type: MouseEventType;
    properties: t;
    e: MouseEvent | atlas.MapMouseEvent | Event | TargetedEvent;
  }

  export interface MapEvent {
    e: atlas.MapMouseEvent;
    type: MouseEventType;
  }

  type MapEventType =
    | 'boxzoomend'
    | 'boxzoomstart'
    | 'click'
    | 'contextmenu'
    | 'data'
    | 'dblclick'
    | 'drag'
    | 'dragend'
    | 'dragstart'
    | 'error'
    | 'idle'
    | 'layeradded'
    | 'layerremoved'
    | 'load'
    | 'mousedown'
    | 'mouseenter'
    | 'mouseleave'
    | 'mousemove'
    | 'mouseout'
    | 'mouseover'
    | 'mouseup'
    | 'move'
    | 'moveend'
    | 'movestart'
    | 'pitch'
    | 'pitchend'
    | 'pitchstart'
    | 'ready'
    | 'render'
    | 'resize'
    | 'rotate'
    | 'rotateend'
    | 'rotatestart'
    | 'sourceadded'
    | 'sourcedata'
    | 'sourceremoved'
    | 'styledata'
    | 'styleimagemissing'
    | 'tokenacquired'
    | 'touchcancel'
    | 'touchend'
    | 'touchmove'
    | 'touchstart'
    | 'wheel'
    | 'zoom'
    | 'zoomend'
    | 'zoomstart';

  type MouseEventType =
    | 'mousedown'
    | 'mouseup'
    | 'mouseover'
    | 'mousemove'
    | 'click'
    | 'dblclick'
    | 'mouseout'
    | 'mouseenter'
    | 'mouseleave'
    | 'contextmenu';

  /**
   * Datasource types
   */
  export type DataSource = Polygon | MultiPolygon | FeatureCollection;

  interface Polygon extends DataSourceSrc {
    type: 'Polygon';
    coordinates: data.Position[] | data.Position[][];
  }

  interface MultiPolygon extends DataSourceSrc {
    type: 'MultiPolygon';
    coordinates: data.Position[][][];
  }

  interface FeatureCollection extends DataSourceSrc {
    type: 'FeatureCollection';
    features: data.Feature<data.Geometry, any>[];
  }

  // data: data.Polygon | data.FeatureCollection | data.Point | data.MultiPoint |
  // data.LineString | data.MultiLineString | data.MultiPolygon | data.Feature<...> | data.GeometryCollection
  // | atlas.Shape | (data.Polygon | ... 6 more ... | atlas.Shape)[]
  interface DataSourceSrc {
    /** ID of datasource entity */
    id: string;
    options?: atlas.DataSourceOptions;
    type: 'Polygon' | 'FeatureCollection' | 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'MultiPolygon';
    bbox?: data.BoundingBox;
  }

  export interface CameraOptions {
    bounds: any;
    options?: any;
    centerOffset?: number;
  }

  export interface HtmlMarker<t = any> {
    id: string;
    options: atlas.HtmlMarkerOptions;
    popup?: atlas.PopupOptions | null;
    events?: {
      marker?: {
        mouseenter?: EventEmitter<any>;
        click?: EventEmitter<any>;
      };
      popup?: {
        dblclick?: EventEmitter<any>;
        click?: EventEmitter<any>;
        close?: EventEmitter<any>;
      };
    };
    src?: t;
  }

  /**
  export interface HtmlMarker<t = any> extends atlas.HtmlMarker {
    events?: {
      click?: EventEmitter<any>;
    };
    src?: t;
  }
   */

  //  export interface Popup {
  /** Map pin content */
  //  htmlContent: string | Location2String;
  /** CSS classes to apply to the map pin. Supports a callback fn that supplies the location */
  //  classes?: string | Location2String;
  /** AzureMaps popup options */
  //   options?: atlas.Options;
  //  }

  type Marker2String = (l: any) => string;

  /** Config is custom/user generated state */
  export interface Config {
    loaded: boolean;
    zoom?: number;
  }

  /***/
  export interface State {
    settings?: Settings | null;
    map?: atlas.Map | null;
    zoom?: number | null;
    layers?: Layer[] | null;
    dataSources?: DataSource[];
    markers?: HtmlMarker[] | null;
    markersActive?: string[] | null;
    actions?: {
      cameraOptions?: CameraOptions | null;
      zoomTo?: CameraOptions | null;
      markersActive?: string[] | null;
    };
    status?: {
      cluster?: boolean;
    };
  }

  export interface Action<t> {
    type: Actions;
    payload: t;
  }

  export enum Actions {
    mapLoaded = 'mapLoaded',
    dataSourcesChange = 'dataSourcesChange',
    loaded = 'loaded',
    markersAdd = 'markersAdd',
    markersActiveAdd = 'markersActiveAdd',
    layersAdd = 'layersAdd',
    zoomChange = 'zoomChange',
    settingsChange = 'settingsChange',
    cameraOptions = 'cameraOptions',
    resize = 'resize',
    destroy = 'destroy',
  }

  export enum View {
    markers = 'markers',
    heatmap = 'heatmap',
    clusters = 'clusters',
  }

  // Handle poorly typed Azure Maps interfaces
  export interface IHtmlMarker extends atlas.HtmlMarker {
    id?: string;
  }
}
