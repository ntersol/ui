import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IStore } from '@shared';// HttpClient, 

@Injectable()
export class UISelectors{

	public modal$ = this.store.select(store => store.ui.modal);

	constructor(
        private store: Store<IStore.root>
	) {
	}

}
