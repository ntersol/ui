import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'nts-state-management',
  templateUrl: './state-management.component.html',
  styleUrls: ['./state-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
