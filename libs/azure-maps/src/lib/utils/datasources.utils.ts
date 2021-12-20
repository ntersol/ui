import atlas, { source, data } from 'azure-maps-control';
import { NtsAzureMaps } from '../azure-maps.models';
// import { isNotNil } from '.';

/**
 *  Add or change data for a datasource
 * @param state
 * @param dataSourcesSrc
 */
export const dataSourcesChange = (map?: atlas.Map | null, dataSources?: NtsAzureMaps.DataSource[]) => {
  if (!map || !dataSources) {
    return;
  }

  dataSources.forEach(ds => {
    if (!ds.id) {
      console.error('This datasource is missing an ID ', ds);
      return;
    }
    // If datasource does not exist, create it
    if (!map.sources.getById(ds.id)) {
      map.sources.add(new source.DataSource(ds.id, ds.options));
    }
    // Get reference to existing datasource
    const src = map.sources.getById(ds.id) as atlas.source.DataSource;
    // If options specified, update options
    if (ds.options) {
      src.setOptions(ds.options);
    }

    // Manage deltas between datasoure changes
    // TODO: Support additional types
    switch (ds.type) {
      case 'Polygon':
        src.setShapes([new data.Polygon(ds.coordinates)]);
        break;
      case 'MultiPolygon':
        src.setShapes([new data.MultiPolygon(ds.coordinates)]);
        break;
      case 'FeatureCollection':
        const feature = new data.FeatureCollection(ds.features);
        src.clear();
        src.add(feature);
        break;
    }
  });
};

/**
 * Merge new sources with existing. Sources are always additive so that only the deltas are updated
 * @param src
 * @param latest
 */
export const dataSourcesMerge = (src?: NtsAzureMaps.DataSource[], latest?: NtsAzureMaps.DataSource[]): NtsAzureMaps.DataSource[] => {
  const existing = src ? [...src] : []; // Null check
  const updated = latest ? [...latest] : []; // Null check

  // Convert array to record
  const existingRecord: Record<string, NtsAzureMaps.DataSource> = existing.reduce((a, b) => ({ ...a, [b.id]: b }), {});
  updated.forEach(ds => (existingRecord[ds.id] = { ...ds })); // Overwrite any existing
  return Object.keys(existingRecord).map(key => existingRecord[key]);
};
