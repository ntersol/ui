import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// import { DomainService } from '$domain';
// import { UiStateService } from '$ui';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonComponent implements OnInit, OnDestroy {

  constructor(
    // private domainState: DomainService, // Global domain state
    // public uiState: UiStateService, // Global UI state
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }
}
