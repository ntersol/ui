import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppStore } from '$shared';

@Injectable({
  providedIn: 'root',
})
export class UiSelectorsService {
  public sidebarOpen$ = this.store.select(store => store.ui.sidebarOpen);
  public saveState$ = this.store.select(store => store.ui.saveState);
  public modal$ = this.store.select(store => store.ui.modal);
  public multiScreen$ = this.store.select(store => store.ui.multiScreen);
  public tabActive$ = (tabInstanceId: string) => this.store.select(store => store.ui.tabsActive[tabInstanceId]);

  constructor(private store: Store<AppStore.Root>) {}
}
