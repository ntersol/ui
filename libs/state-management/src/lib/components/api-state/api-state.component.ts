import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NtsCombineEntityState } from '../../utils/combineEntityState.util';
import { NtsState } from '../../state.models';

@Component({
  selector: 'nts-api-state',
  templateUrl: './api-state.component.html',
  styleUrls: ['./api-state.component.scss'],
})
export class NtsDomainStateComponent implements OnInit, OnChanges {
  /** Default domain state */
  @Input() set state(state: NtsState.EntityState | (NtsState.EntityState | unknown)[] | null) {
    this.stateSrc = NtsCombineEntityState(state);
  }

  /** Should the state component look the modify state instead of load state */
  @Input() modify = false;
  /** Should this component show loading state? */
  @Input() showLoading = true;
  /** Should this component show modifying state? */
  @Input() showModifying = true;
  /** Should this component show loading error */
  @Input() showErrorLoading = true;
  /** Should this component show modifying error? */
  @Input() showErrorModifying = true;

  /** Holds combined state of any number entity state objects */
  public stateSrc: NtsState.ApiState | undefined;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    // console.log({...this.stateSrc});
  }
}
