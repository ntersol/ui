import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

// Global state
// import { DomainService } from '$domain';
// import { UiStateService } from '$ui';
// import { SettingsService } from 'src/app/shared/state/settings';

// Route State
// import { RouteUiStateService } from '../../shared/state/ui';
// import { RouteDomainStateService } from '../../shared/state/domain';

@Component({
  selector: 'nts-show-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  // private domainState: DomainService, // Global domain state
  // public uiState: UiStateService, // Global UI state
  // private routeDomainState: RouteDomainStateService, // Route only domain state
  // private routeUIState: RouteUiStateService, // Route only UI state
  // private settings: SettingsService, // App settings/global properties
}
