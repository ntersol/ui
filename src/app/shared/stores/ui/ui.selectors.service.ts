import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppStore } from '$shared';

@Injectable()
export class UiSelectorsService {

  public saveState$ = this.store.select(store => store.ui.saveState);
  public modal$ = this.store.select(store => store.ui.modal);
  public multiScreen$ = this.store.select(store => store.ui.multiScreen);

  constructor(private store: Store<AppStore.Root>) { }

}
