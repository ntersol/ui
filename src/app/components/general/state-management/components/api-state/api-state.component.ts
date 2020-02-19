import { Component, OnInit, Input } from '@angular/core';
import { EntityStateExtended } from '../..';

@Component({
  selector: 'nts-api-state',
  templateUrl: './api-state.component.html',
  styleUrls: ['./api-state.component.scss'],
})
export class NtsDomainStateComponent implements OnInit {
  /** Default domain state */
  @Input() state: EntityStateExtended | undefined;
  /** Should the state component look the modify state instead of load state */
  @Input() modify = false;

  /** Should errors be shown */
  // @Input() errorVisible = true;
  /** Custom error message */
  // @Input() errorMessage!: string;
  /** Should the loader be shown when data is already present in state */
  // @Input() loaderDisabled = false;

  constructor() {}

  ngOnInit() {}
}
