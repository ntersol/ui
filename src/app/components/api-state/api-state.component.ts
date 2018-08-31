import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';

import { AppStore } from '$shared';

@Component({
  selector: 'app-api-state',
  templateUrl: './api-state.component.html',
  styleUrls: ['./api-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiStateComponent implements OnInit {
  @Input()
  state: AppStore.ApiState<any>;

  public errorHide = true;

  constructor() {}

  ngOnInit() {}
}
