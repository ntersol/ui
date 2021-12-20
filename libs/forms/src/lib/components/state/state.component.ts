import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'nts-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsStateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
