import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { smartDistinctUntilChanged } from '@ntersol/state-management';
import { BehaviorSubject, tap } from 'rxjs';
import { HighlightService } from '../../../../../shared/services/highlight.service';
import { StateManagementService } from '../../../shared/state-management.service';

@UntilDestroy()
@Component({
  selector: 'nts-smart-distinct-until-changed',
  templateUrl: './smart-distinct-until-changed.component.html',
  styleUrls: ['./smart-distinct-until-changed.component.scss'],
})
export class SmartDistinctUntilChangedComponent implements OnInit, OnDestroy {
  public install = `
  npm i @ntersol/state-management --save`;

  public inner = `
  // Import
  import { smartDistinctUntilChanged } from '@ntersol/state-management';

  // Usage
  // Create an observable stream
  public source$ = of({a: 1, b: 2}, {a: 1, b: 2}, {a: 2, b: 3});

  // Apply the smartDistinctUntilChanged operator to the stream
  public result$ = this.source$.pipe(
    smartDistinctUntilChanged(),
  );

  // Subscribe to the result stream
  result$.subscribe(console.log);

  // Output in the console:
  // { a: 1, b: 2 }
  // { a: 2, b: 3 }
  `;

  private _src$ = new BehaviorSubject<any>(null);
  public source$ = this._src$.pipe(
    tap((data) => console.log('New data in stream', data)),
    smartDistinctUntilChanged(),
    tap((data) => console.warn('Subscription updated ', data)),
  );

  //

  constructor(private highlight: HighlightService, public api: StateManagementService) {}

  ngOnInit(): void {
    this.source$.pipe(untilDestroyed(this)).subscribe();
  }

  public testPipe() {
    console.log('### Testing Primitives ###');
    this._src$.next(null);
    this._src$.next(null);
    this._src$.next(undefined);

    this._src$.next(100);
    this._src$.next(100);
    this._src$.next(100);
    this._src$.next(1.256);
    this._src$.next(1.256);
    this._src$.next('Hello');
    this._src$.next('Hello');
    this._src$.next('World');
    this._src$.next(true);
    this._src$.next(true);
    this._src$.next(false);

    console.log('### Testing Arrays ###');
    this._src$.next([]);
    this._src$.next([]);
    this._src$.next([1, 2, 3, 4, 5]);
    this._src$.next([1, 2, 3, 4, 5]);
    this._src$.next([5, 2, 3, 4, 5, 1]);
    this._src$.next(['Hello', 2, 3]);
    this._src$.next(['Hello', 2, 3]);
    this._src$.next([1, 2, 3, 4, 5]);
    this._src$.next([{ Hello: 'World', Name: 'Bob' }]);
    this._src$.next([{ Hello: 'World', Name: 'Bob' }]);
    this._src$.next([{ Name: 'Bob', Hello: 'World' }]); // <-- Problem

    console.log('### Testing Objects ###');
    this._src$.next({ nameFirst: 'John', nameLast: 'Doe' });
    this._src$.next({ nameFirst: 'John', nameLast: 'Doe' });
    this._src$.next({ nameLast: 'Doe', nameFirst: 'John' });

    this._src$.next({ nameLast: 'Doe', nameFirst: 'John', address: ['Irvine'], age: 1 });
    this._src$.next({ address: ['Irvine'], nameFirst: 'John', age: 1, nameLast: 'Doe' });
    this._src$.next({ nameLast: 'Doe', nameFirst: 'John', address: ['San Diego'], age: 1 });
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

  ngOnDestroy(): void {}
}
