import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

// Global state
// import { DomainService } from '$domain';
// import { UiStateService } from '$ui';
// import { SettingsService } from 'src/app/shared/state/settings';

// Route State
// import { RouteUiStateService } from '../../shared/state/ui';
// import { RouteDomainStateService } from '../../shared/state/domain';

@Component({
  selector: 'nts-show-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DocsComponent {
}
