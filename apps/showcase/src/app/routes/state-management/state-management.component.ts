import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-state-management',
  templateUrl: './state-management.component.html',
  styleUrls: ['./state-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementComponent implements OnInit, OnDestroy {
  constructor() {} // public uiState: UiStateService, // Global UI state // private domainState: DomainService, // Global domain state

  ngOnInit() {}

  ngOnDestroy() {}
}
