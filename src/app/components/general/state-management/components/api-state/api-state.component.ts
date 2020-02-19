import { Component, OnInit, Input } from '@angular/core';
import { NtsCombineEntityState } from '../../utils/combineEntityState.util';

@Component({
  selector: 'nts-api-state',
  templateUrl: './api-state.component.html',
  styleUrls: ['./api-state.component.scss'],
})
export class NtsDomainStateComponent implements OnInit {
  /** Default domain state */
  @Input() set state(state: NtsState.EntityState | (NtsState.EntityState | unknown)[] | null) {
    this.stateSrc =  NtsCombineEntityState(state);
  }

  /** Should the state component look the modify state instead of load state */
  @Input() modify = false;
  /** Should this component show loading state? */
  @Input() showLoading = true;
  /** Should this component show modifying state? */
  @Input() showModifying = true;

  /** Holds combined state of any number entity state objects */
  public stateSrc: NtsState.State | undefined;

  constructor() {}

  ngOnInit() {}
}
