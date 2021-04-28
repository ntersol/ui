import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewEncapsulation } from '@angular/core';

// Global state
// import { DomainService } from '$domain';
// import { UiStateService } from '$ui';
// import { SettingsService } from 'src/app/shared/state/settings';

// Route State
// import { RouteUiStateService } from '../../shared/state/ui';
// import { RouteDomainStateService } from '../../shared/state/domain';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DocsComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit() {}

  /** Must be present even if not used for autounsub */
  ngOnDestroy() {}
}
