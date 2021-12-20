import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-number',
  templateUrl: '../input/input.component.html',
  styleUrls: ['./number.component.scss', '../input/input.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberComponent extends NtsInputComponent<number> implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
