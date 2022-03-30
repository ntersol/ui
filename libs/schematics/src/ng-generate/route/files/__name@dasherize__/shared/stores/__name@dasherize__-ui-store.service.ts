import { Injectable } from '@angular/core';
import { ntsUIStoreCreator } from '@ntersol/state-management';

// Set up interface for the store
interface <%= classify(name) %>UIStoreModel {
  name: string | null;
  user?: {
    nameFirst: string | null;
    age: number;
  };
}

/**
 * Route only UI state
 * By default they are not injected in root since they are only needed by this route
 */
@Injectable()
export class <%= classify(name) %>UiService {
  // Create a ui store creator instance with default state using interface model and options
  public uiStore = ntsUIStoreCreator<<%= classify(name) %>UIStoreModel>(
    { name: null, user: { age: 12, nameFirst: 'NameFirst123' } },
    { persistId: 'uiStore' },
  );

  // Get the name slice of state as an observable
  public name$ = this.uiStore.select$('name');

  constructor() {}
}
