import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StateManagementService } from './shared/state-management.service';

@Component({
  selector: 'nts-state-management',
  templateUrl: './state-management.component.html',
  styleUrls: ['./state-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementComponent implements OnInit {
  public users$ = this.domain.users.select$;

  constructor(private domain: StateManagementService) {}

  ngOnInit(): void {}
}
