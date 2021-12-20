import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// import { DomainService } from '$domain';
// import { UiStateService } from '$ui';

@Component({
  selector: 'app-state-management',
  templateUrl: './state-management.component.html',
  styleUrls: ['./state-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementComponent implements OnInit, OnDestroy {

  constructor(
    // private domainState: DomainService, // Global domain state
    // public uiState: UiStateService, // Global UI state
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }
}
