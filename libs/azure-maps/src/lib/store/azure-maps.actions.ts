import { NtsAzureMaps } from '../azure-maps.models';
import * as atlas from 'azure-maps-control';

export const Action = {
  mapLoaded: (p: atlas.Map): NtsAzureMaps.Action<atlas.Map> => ({ type: NtsAzureMaps.Actions.mapLoaded, payload: p }),
  zoomChange: (p: number): NtsAzureMaps.Action<number> => ({ type: NtsAzureMaps.Actions.zoomChange, payload: p }),
  dataSourcesChange: (p: NtsAzureMaps.DataSource[]): NtsAzureMaps.Action<NtsAzureMaps.DataSource[]> => ({
    type: NtsAzureMaps.Actions.dataSourcesChange,
    payload: p,
  }),
  markersAdd: (p: NtsAzureMaps.HtmlMarker[]): NtsAzureMaps.Action<NtsAzureMaps.HtmlMarker[]> => ({
    type: NtsAzureMaps.Actions.markersAdd,
    payload: p,
  }),
  markersActiveAdd: (p: string[] | null): NtsAzureMaps.Action<string[] | null> => ({
    type: NtsAzureMaps.Actions.markersActiveAdd,
    payload: p,
  }),
  layersChange: (p: NtsAzureMaps.Layer[]): NtsAzureMaps.Action<NtsAzureMaps.Layer[]> => ({
    type: NtsAzureMaps.Actions.layersAdd,
    payload: p,
  }),
  settingsChange: (p: NtsAzureMaps.Settings): NtsAzureMaps.Action<NtsAzureMaps.Settings> => ({
    type: NtsAzureMaps.Actions.settingsChange,
    payload: p,
  }),
  cameraOptions: (p: NtsAzureMaps.CameraOptions): NtsAzureMaps.Action<NtsAzureMaps.CameraOptions> => ({
    type: NtsAzureMaps.Actions.cameraOptions,
    payload: p,
  }),
  resize: (p?: null | boolean | undefined): NtsAzureMaps.Action<null | boolean | undefined> => ({
    type: NtsAzureMaps.Actions.resize,
    payload: p,
  }),
  destroy: (p?: null): NtsAzureMaps.Action<null | undefined> => ({ type: NtsAzureMaps.Actions.destroy, payload: p }),
};

export const isAction = {
  mapLoaded: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<atlas.Map> => p.type === NtsAzureMaps.Actions.mapLoaded,
  dataSourcesChange: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<NtsAzureMaps.DataSource[]> =>
    p.type === NtsAzureMaps.Actions.dataSourcesChange,
  layersAdd: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<NtsAzureMaps.Layer[]> => p.type === NtsAzureMaps.Actions.layersAdd,
  markersAdd: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<NtsAzureMaps.HtmlMarker[]> =>
    p.type === NtsAzureMaps.Actions.markersAdd,
  markersActiveAdd: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<string[] | null> =>
    p.type === NtsAzureMaps.Actions.markersActiveAdd,
  zoomChange: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<number> => p.type === NtsAzureMaps.Actions.zoomChange,
  settingsChange: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<NtsAzureMaps.Settings> =>
    p.type === NtsAzureMaps.Actions.settingsChange,
  cameraOptions: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<NtsAzureMaps.CameraOptions> =>
    p.type === NtsAzureMaps.Actions.cameraOptions,
  destroy: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<null> => p.type === NtsAzureMaps.Actions.destroy,
  resize: (p: NtsAzureMaps.Action<any>): p is NtsAzureMaps.Action<null | boolean> => p.type === NtsAzureMaps.Actions.resize,
};
