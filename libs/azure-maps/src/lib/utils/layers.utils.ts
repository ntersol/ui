import atlas, { layer, source } from 'azure-maps-control';
import { NtsAzureMaps } from '../azure-maps.models';
import { HtmlMarkerLayer } from '../layers/htmlMarkerLayer.layer';

/**
 * Create layers and add them to the map
 * @param map
 * @param layers
 */
export const layersChange = (
  map?: atlas.Map | null,
  layers?: NtsAzureMaps.Layer[],
  settings?: NtsAzureMaps.Settings | null,
) => {
  if (!map || !layers) {
    return;
  }

  layers.forEach((l) => {
    const layerExisting = map.layers.getLayerById(l.id) as layer.Layer<layer.LayerEvents> | undefined;
    // If datasource hasn't loaded yet, create it using that id
    // Some layers do not need sources
    if (l.sourceId && !map?.sources.getById(l.sourceId)) {
      map.sources.add(new source.DataSource(l.sourceId));
    }

    // Check if layer already exists, remove it
    if (layerExisting) {
      map.layers.remove(l.id);
    }

    let layerSrc: layer.Layer<any> | undefined;
    switch (l.type) {
      case 'HtmlMarkerLayer':
        layerSrc = new HtmlMarkerLayer(l, settings);
        map?.layers.add(layerSrc, l.before);
        break;
      case 'Polygon':
        layerSrc = new layer.PolygonLayer(l.sourceId, l.id, l.options);
        map?.layers.add(layerSrc, l.before);
        break;
      case 'Line':
        layerSrc = new layer.LineLayer(l.sourceId, l.id, l.options);
        map?.layers.add(layerSrc, l.before);
        break;
      case 'Bubble':
        layerSrc = new layer.BubbleLayer(l.sourceId, l.id, l.options);
        map?.layers.add(layerSrc, l.before);
        // On bubble layer click, zoom into next cluster breakout
        if (l.config?.zoomOnClick !== false) {
          map.events.add('click', layerSrc, bubbleLayerZoom);
        }
        break;
      case 'Symbol':
        layerSrc = new layer.SymbolLayer(l.sourceId, l.id, l.options);
        map?.layers.add(layerSrc, l.before);
        break;
      case 'TileLayer':
        layerSrc = new layer.TileLayer(l.options);
        map.layers.add(layerSrc, l.before);
    }

    // Emit layer events to parent
    if (l.events && l.emitter) {
      l.events.forEach((e) => {
        map.events.add(e, layerSrc as any, (event) => {
          const shapes = (event as any).shapes;
          const shape = shapes?.length && shapes[0]?.getProperties ? shapes[0] : null;
          l?.emitter?.emit({ event: event as any, eventType: e, layerId: l.id, shape: shape });
        });
      });
    }
  });
};

/**
 * When a clustered bubble layer is clicked, zoom into the next cluster break step
 * @param e
 */
const bubbleLayerZoom = (e: atlas.MapMouseEvent) => {
  const shapes = e.shapes as atlas.data.Feature<atlas.data.Geometry, any>[];
  if (shapes && shapes.length && shapes[0]?.properties?.cluster) {
    // Get the clustered point from the event.
    const cluster = shapes[0];
    // Get datasource attached to this layer
    const datasource = e.map.sources.getById((cluster as any).source) as source.DataSource;
    // If both source and layer are returned
    if (cluster && datasource) {
      // Get the next cluster expansion
      datasource.getClusterExpansionZoom(cluster.properties.cluster_id).then((zoom) => {
        // Update the map camera to be centered over the cluster.
        e.map.setCamera({
          center: cluster.geometry.coordinates,
          zoom: zoom,
          type: 'ease',
          duration: 200,
        });
      });
    }
  }
};
