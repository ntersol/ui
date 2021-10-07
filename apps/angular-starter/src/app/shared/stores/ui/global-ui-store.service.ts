import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { merge } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { SwUpdate } from '@angular/service-worker';
import { NtsServiceWorkerService, NtsVersionManagementService } from '../../services/general';
import { ntsUIStoreCreator } from '@ntersol/state-management';

// Set up interface for the store
interface GlobalUIStoreModel { }


// tslint:disable-next-line:max-classes-per-file
@Injectable({ providedIn: 'root' })
export class UiStateService {

  // Create a ui store creator instance with default state using interface model and options
  public uiStore = ntsUIStoreCreator<GlobalUIStoreModel>({}, { persistId: 'globalUIStore' });

  /** Is an app update available, either from the service worker or the version checker */
  public updateAvailable$ = merge(this.ntsSw.updateAvailable$, this.ntsVersion.updateAvailable$);

  constructor(
    private confirmationService: ConfirmationService,
    private sw: SwUpdate,
    private ntsSw: NtsServiceWorkerService,
    private ntsVersion: NtsVersionManagementService,
  ) {
    // this.query.uiState$.subscribe(state => console.log('UI STATE', state));
    this.updateAvailable$.pipe(filter(val => val)).subscribe(() => this.updateAppModal());
  }

  public updateAppModal() {
    this.confirmationService.confirm({
      message: 'An update for this application is available, would you like to update?',
      header: 'Confirmation',
      accept: () => (this.sw.isEnabled ? this.sw.activateUpdate().then(() => document.location.reload()) : document.location.reload()),
      // reject: () => console.log('Nope!!!'),
    });
  }

}
