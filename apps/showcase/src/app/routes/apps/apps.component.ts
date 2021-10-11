import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// import { DomainService } from '$domain';
// import { UiStateService } from '$ui';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppsComponent implements OnInit, OnDestroy {

  constructor(
    // private domainState: DomainService, // Global domain state
    // public uiState: UiStateService, // Global UI state
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }
}
