import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-input-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsCurrencyComponent extends NtsInputComponent<number> implements OnInit {

  @Input() disabled = false

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
