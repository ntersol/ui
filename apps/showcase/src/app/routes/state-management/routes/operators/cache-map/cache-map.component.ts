import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../../shared/services/highlight.service';
import { StateManagementService } from '../../../shared/state-management.service';

@Component({
  selector: 'nts-cache-map',
  templateUrl: './cache-map.component.html',
  styleUrls: ['./cache-map.component.scss'],
})
export class CacheMapComponent implements OnInit {
  public install = `
  npm i @ntersol/state-management --save`;

  public inner = `
  // Import
  import { cacheMap } from '@ntersol/state-management';

  // Usage
  public user$ = this.userID$.pipe(
    cacheMap((userID) => this.http.get<Models.User>('//jsonplaceholder.typicode.com/users/\${userID}')),
  )

  // Example with options. Cache will expire after 60 seconds.
  public user$ = this.userID$.pipe(
    cacheMap((userID) => this.http.get<Models.User>('//jsonplaceholder.typicode.com/users/\${userID}', {ttl: 60})),
  )`;

  public usage1 = `
  type Options<t> = {
    /** How long should this response belong in the cache in seconds */
    ttl?: number | null;
    /** Supply a function that returns the upstream data and expects a string to use as a unique ID. Overrides the default ID handling and is useful for scenarios where the upstream data is a non-primitive */
    uniqueIdFn?: null | ((val: t) => string | number);
    /** A unique ID to identify this cache. Only used to clear cache. Cache is not cleared immediately, only before next emission */
    cacheId?: string | null;
  };`;

  public usage2 = `
  // Import the cacheMapClear method
  import { cacheMapClear } from '@ntersol/state-management';

  // Add a uniqueID to the cache map operator
  public user$ = this.userID$.pipe(
    cacheMap((userID) => this.http.get<Models.User>('//jsonplaceholder.typicode.com/users/\${userID}', { cacheId: 'users'})),
  );

  // Add a method to clear the cache. The ID needs to correspond to the one used by the operator
  // Cache is not cleared immediately, only on a subsequent emission
  public clearCache(){
    cacheMapClear('users');
  }
  `;
  constructor(private highlight: HighlightService, public api: StateManagementService) {}

  ngOnInit(): void {}

  public updateUser(id: number) {
    this.api.userID$.next(id);
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
