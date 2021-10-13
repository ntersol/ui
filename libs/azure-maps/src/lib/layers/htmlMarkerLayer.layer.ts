/* Ref: https://azuremapscodesamples.azurewebsites.net/HTML%20Markers/HtmlMarkerLayer/HTML%20Marker%20Layer.html
 * Copyright(c) 2019 Microsoft Corporation. All rights reserved.
 *
 * This code is licensed under the MIT License (MIT).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import atlas, { layer, Shape, HtmlMarker, Popup, ClusteredProperties } from 'azure-maps-control';
import { NtsAzureMaps } from '../azure-maps.models';
import { markerEvents } from '../utils/markers.utils';
/**
 * A layer that renders point data from a data source as HTML elements on the map.
 */
export class HtmlMarkerLayer extends layer.BubbleLayer {
  private _options: {
    sourceLayer: any;
    source: any;
    filter: any;
    minZoom: number;
    maxZoom: number;
    visible: boolean;
    updateWhileMoving: boolean;
    markerRenderCallback: (id: any, position: any, properties: any) => HtmlMarker;
    clusterRenderCallback: (id: any, position: any, properties: any) => HtmlMarker;
  };
  _markers: any[];
  _markerIds: any[];
  _markerCache: Record<string, any>;
  _map?: atlas.Map | null;

  public settings?: NtsAzureMaps.Settings | null;
  public markerLayer?: NtsAzureMaps.HtmlMarkerLayer;
  public dataSource?: atlas.source.DataSource;
  public layer?: atlas.layer.Layer;
  public _hasMarkers = false;
  /** A list of marker IDs to set as active */
  private markersActive?: string[] | null;
  /*********************
   * Constructor
   *********************/
  /**
   * Constructs a new HtmlMarkerLayer.
   * @param source The id or instance of a data source which the layer will render.
   * @param id The id of the layer. If not specified a random one will be generated.
   * @param options The options of the Html marker layer.
   */
  constructor(markerLayer: NtsAzureMaps.HtmlMarkerLayer, settings?: NtsAzureMaps.Settings | null) {
    super(markerLayer?.sourceId || '', markerLayer.id, {
      color: 'transparent',
      radius: 1,
      strokeWidth: 0,
    });
    /*********************
     * Private Properties
     *********************/
    this.settings = settings;
    this.markerLayer = markerLayer;
    this._options = {
      sourceLayer: undefined,
      source: undefined,
      filter: undefined,
      minZoom: 0,
      maxZoom: 24,
      visible: true,
      updateWhileMoving: false,
      /** Manage marker content and events */
      markerRenderCallback: (_id, position, properties) => {
        const htmlContentFn = this.settings?.marker?.global?.htmlContent;
        let popup;
        if (this.settings?.popup?.global?.content) {
          popup = new Popup({
            position: [0, 0],
            pixelOffset: [0, -18],
            ...this.settings?.popup?.global.options,
            content: this.settings?.popup?.global?.content ? this.settings.popup.global.content(properties) : undefined,
          });
        }

        const marker = new HtmlMarker({
          position: position,
          // htmlContent: htmlContentFn && properties ? htmlContentFn(properties) : undefined,
          htmlContent: `<div class="nts-map-marker nts-map-marker-${properties.$$class || 'single'}">${
            htmlContentFn && properties ? htmlContentFn(properties) : undefined
          }</div>`,
          popup: popup,
        });
        // Add a custom ID if specified
        // AM doesn't expose a method to set the marker ID
        if (this.markerLayer?.uniqueID && properties && properties[this.markerLayer.uniqueID]) {
          (marker as any).id = properties[this.markerLayer?.uniqueID];
        }
        markerEvents(this._map, marker, popup, settings, properties);
        return marker;
      },
      clusterRenderCallback: (_id, position, properties) => {
        // Get the # of characters for the point count
        const size = String(properties?.point_count_abbreviated || 0).length;
        // Calculate the pixel offset. This should be half of the cluster height as defined in the css
        let offset = 12;
        if (size === 2) {
          offset = 15;
        } else if (size === 3) {
          offset = 18;
        } else if (size === 4) {
          offset = 20;
        }
        if (this.dataSource) {
        }

        return new HtmlMarker({
          pixelOffset: [0, offset],
          position: position,
          htmlContent: `<div class="nts-map-cluster nts-map-cluster-size-${size}">${properties.point_count_abbreviated}</div>`,
          // text: properties.point_count_abbreviated,
        });
      },
    };
    this._markers = [];
    this._markerIds = [];
    this._markerCache = {};
    this.setOptions(this.markerLayer.options);
  }

  /*********************
   * Public methods
   *********************/
  /**
   * Gets the options of the Html Marker layer.
   */
  getOptions() {
    return this._options;
  }

  /**
   * Sets the options of the Html marker layer.
   * @param options The new options of the Html marker layer.
   */
  setOptions(options: atlas.BubbleLayerOptions) {
    const newBaseOptions: atlas.BubbleLayerOptions = {};
    let cc = false;
    if (options.source && this._options.source !== options.source) {
      this._options.source = options.source;
      newBaseOptions.source = options.source;
      cc = true;
    }
    if (options.sourceLayer && this._options.sourceLayer !== options.sourceLayer) {
      this._options.sourceLayer = options.sourceLayer;
      newBaseOptions.sourceLayer = options.sourceLayer;
      cc = true;
    }
    if (options.filter && this._options.filter !== options.filter) {
      this._options.filter = options.filter;
      newBaseOptions.filter = options.filter;
      cc = true;
    }
    if (typeof options.minZoom === 'number' && this._options.minZoom !== options.minZoom) {
      this._options.minZoom = options.minZoom;
      newBaseOptions.minZoom = options.minZoom;
    }
    if (typeof options.maxZoom === 'number' && this._options.maxZoom !== options.maxZoom) {
      this._options.maxZoom = options.maxZoom;
      newBaseOptions.maxZoom = options.maxZoom;
    }
    if (typeof options.visible !== 'undefined' && this._options.visible !== options.visible) {
      this._options.visible = options.visible;
      newBaseOptions.visible = options.visible;
    }
    if (options.markerRenderCallback && this._options.markerRenderCallback !== options.markerRenderCallback) {
      this._options.markerRenderCallback = options.markerRenderCallback;
      cc = true;
    }
    if (options.clusterRenderCallback && this._options.clusterRenderCallback !== options.clusterRenderCallback) {
      this._options.clusterRenderCallback = options.clusterRenderCallback;
      cc = true;
    }
    if (typeof options.updateWhileMoving === 'boolean' && this._options.updateWhileMoving !== options.updateWhileMoving) {
      this._options.updateWhileMoving = options.updateWhileMoving;
    }
    if (cc) {
      this.clearCache(true);
    } else {
      this.updateMarkers();
    }
    super.setOptions(newBaseOptions);
  }

  /** Force the layer to refresh and update. */
  update() {
    this.clearCache(true);
    this.updateMarkers();
  }

  /***************************
   * Public override methods
   ***************************/
  /**
   * Override the layers onAdd function
   * @param map
   */
  onAdd(map: any) {
    // Remove any existing event handlers
    if (this._map) {
      this._map.events.remove('moveend', () => this.updateMarkers());
      this._map.events.remove('move', () => this.mapMoved());
      this._map.events.remove('sourcedata', () => this.sourceUpdated());
      this._map?.events.remove('zoomend', () => this.updateMarkers());
    }
    // Add custom event handlers
    this._map = map;
    if (this.markerLayer?.config?.updateOn?.moveend) {
      this._map?.events.add('moveend', () => this.updateMarkers());
    }
    if (this.markerLayer?.config?.updateOn?.move) {
      this._map?.events.add('move', () => this.updateMarkers());
    }
    if (this.markerLayer?.config?.updateOn?.zoomend) {
      this._map?.events.add('zoomend', () => this.updateMarkers());
    }

    // Make sure that the layer and datasource exist for this
    // Set to global properties
    this.layer = this._map?.layers.getLayerById(this.markerLayer?.id || '');
    this.dataSource = this._map?.sources.getById(this.markerLayer?.sourceId || '') as atlas.source.DataSource;
    if (this.layer && this.dataSource && this._map) {
      // When the data is changed from the datasource
      // Note that this works because all datasource changes are new data
      this._map.events.add('dataadded', this.dataSource, () => {
        // Wait till idle event completes, otherwise map data has not been updated and data is stale
        this._map?.events.addOnce('idle', () => this.sourceUpdated());
      });
    }
    // Call the underlying functionaly for this.
    super.onAdd(map);
  }

  /**
   * Override the layers onRemove function
   */
  onRemove() {
    if (this._map) {
      this._map.events.remove('moveend', () => this.updateMarkers());
      this._map.events.remove('move', () => this.mapMoved());
      this._map.events.remove('sourcedata', () => this.sourceUpdated());
      this._map?.events.remove('zoomend', () => this.updateMarkers());
    }
    this.clearCache(false);
    this._map = null;
    super.onRemove();
  }
  /*********************
   * Private methods
   *********************/
  mapMoved() {
    if (this._options.updateWhileMoving) {
      this.updateMarkers();
    }
  }

  getSourceClass() {
    const s = this.getSource();
    if (typeof s === 'string' && this._map !== null) {
      return this._map?.sources.getById(s);
    } else if (atlas?.source?.Source && s instanceof atlas?.source?.Source) {
      return s;
    }
    return null;
  }

  sourceUpdated() {
    const s = this.getSourceClass();
    if (s) {
      this.clearCache(true);
    }
  }

  /**
   * Update any active markers
   * @param activeMarkers
   */
  public markersActiveChange(activeMarkers?: string[] | null) {
    if (JSON.stringify(activeMarkers) !== JSON.stringify(this.markersActive)) {
      this.markersActive = activeMarkers;
      // If markers active is set, look through current markers and set active status
      if (this.markersActive?.length) {
        this._map?.markers.getMarkers().forEach((m: any) => {
          if (this.markersActive?.includes(m.id)) {
            const elem = m.element as HTMLDivElement;
            elem.classList.add('marker-active');
          }
        });
      } else {
        // If nil gets passed, remove all active stats
        this._map?.markers.getMarkers().forEach((m: any) => {
          if (this.markersActive?.includes(m.id)) {
            const elem = m.element as HTMLDivElement;
            elem.classList.remove('marker-active');
          }
        });
      }
    }
  }

  clearCache(update: any) {
    this._markerCache = {}; // Clear marker cache.
    if (this._map) {
      this._map.markers.remove(this._markers);
    }
    this._markers = [];
    this._markerIds = [];
    if (update && this?._map) {
      this.updateMarkers();
    }
  }

  /**
   * Update marker clusters and pins
   */
  public updateMarkers() {
    const zoom = this._map?.getCamera().zoom;

    if (!this._map || !zoom) {
      return;
    }

    // Show markers only once when zoom threshold has been crossed
    if (this._map && zoom >= this._options.minZoom && zoom <= this._options.maxZoom) {
      this._hasMarkers = true;
      const shapes = this._map.layers.getRenderedShapes(undefined, this, this._options.filter);
      const newMarkers = [];
      const newMarkerIds = [];
      let id: any;
      let properties: any;
      let position: any;
      let shape: any;
      let feature: any;
      let marker: NtsAzureMaps.IHtmlMarker | null;
      for (let i = 0, len = shapes.length; i < len; i++) {
        marker = null;
        if (shapes[i] instanceof Shape) {
          shape = shapes[i];
          if (shape.getType() === 'Point') {
            position = shape.getCoordinates();
            properties = shape.getProperties();
            // If an ID is on the marker data
            if (shape.data.id) {
              id = shape.data.id;
            } else if (this.markerLayer?.uniqueID && shape?.data?.properties) {
              id = shape.getId();
            } else {
              id = shape.getId();
            }
          }
        } else {
          feature = shapes[i];
          if (feature.geometry.type === 'Point') {
            position = feature.geometry.coordinates;
            properties = feature.properties;
            if (properties && properties.cluster) {
              id = 'cluster_' + feature.properties.cluster_id;
            } else if (feature.id) {
              id = feature.id;
            }
          }
        }
        if (position) {
          marker = this.getMarker(id, position, properties);
          if (marker) {
            if (marker.id) {
              // If this marker's ID is found in the active array, set as active
              if (this.markersActive?.length && this.markersActive.includes(marker.id)) {
                const elem = (marker as any).element as HTMLDivElement;
                elem.classList.add('marker-active');
              }
              // Add to new markers array to be added to the map
              newMarkerIds.push(marker.id);
            }
            if (!marker.id || this._markerIds.indexOf(marker.id) === -1) {
              newMarkers.push(marker);
              this._map.markers.add(marker);
            }
          }
        }
      }
      // Remove all markers that are no longer in view.
      for (let i = this._markers.length - 1; i >= 0; i--) {
        if (!this._markers[i].id || newMarkerIds.indexOf(this._markers[i].id) === -1) {
          this._map.markers.remove(this._markers[i]);
          this._markers.splice(i, 1);
        }
      }
      this._markers = this._markers.concat(newMarkers);
      this._markerIds = newMarkerIds;
    }

    // Hide markers only once when zoom threshold has been crossed
    if (this._map && (zoom <= this._options.minZoom || zoom >= this._options.maxZoom)) {
      this._hasMarkers = false;
      this._map.markers.clear();
    }
  }

  /**
   * Get existing marker
   */
  public getMarker(id: string, position: atlas.Pixel, properties: ClusteredProperties): NtsAzureMaps.IHtmlMarker | null {
    // Check cache for existing marker.
    if (this._markerCache[id]) {
      return this._markerCache[id];
    } else {
      let m: any;
      if (properties && properties.cluster) {
        if (this._options.clusterRenderCallback && typeof properties.cluster_id === 'number') {
          m = this._options.clusterRenderCallback(id, position, properties);
          // When the user clicks on a cluster, center and zoom the map so that the cluster breaks apart
          this._map?.events.add('click', m, e => {
            this.dataSource?.getClusterExpansionZoom(properties.cluster_id).then(zoom => {
              this._map?.setCamera({
                center: e.target?.getOptions().position,
                zoom: zoom + 0.75,
                type: 'ease',
                duration: 200,
              });
            });
          });
        }
      } else if (this._options.markerRenderCallback) {
        m = this._options.markerRenderCallback(id, position, properties);
      }
      if (m) {
        m.properties = properties;
        m.id = id;
        // Make sure position is set.
        m.setOptions({
          position: position,
        });
        this._markerCache[id] = m;
        return m;
      }
      return null;
    }
  }
}
