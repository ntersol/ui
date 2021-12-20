import { BehaviorSubject, Subject } from 'rxjs';
import { NtsAzureMaps } from '../azure-maps.models';
import { azureMapsReducer } from './azure-maps.reducer';
import atlas from 'azure-maps-control';
/**
 * Manage state for a mapbox instance
 */
export class AzureMapsStore {
  /** AzureMaps Events */
  public events = {
    load$: new Subject<any>(),
    styledata$: new Subject<any>(),
  };

  /** Manage popups */
  public popups = {
    add: (popup: atlas.Popup | atlas.Popup[]) => this.state?.map?.popups.add(popup),
    clear: () => this.state?.map?.popups.clear(),
    getPopups: () => this.state?.map?.popups.getPopups(),
    remove: (popup: atlas.Popup | atlas.Popup[]) => this.state?.map?.popups.remove(popup),
    closeAll: () => this.state?.map?.popups.getPopups().forEach(p => p.close()),
  };

  private state: NtsAzureMaps.State = {};
  public state$ = new BehaviorSubject<NtsAzureMaps.State>({ ...this.state });

  constructor() {}

  /**
   * Pass state changes to the reducer
   * @param action
   */
  public stateChange(action: NtsAzureMaps.Action<any>) {
    this.state = azureMapsReducer(this.state, action);
    this.state$.next(this.state);
  }
}

export const azureMapsStore = () => new AzureMapsStore();
