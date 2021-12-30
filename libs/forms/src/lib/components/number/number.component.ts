import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-input-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NtsNumberComponent extends NtsInputComponent<number> implements OnInit {

  @Input() mode: 'decimal' | 'currency' = 'decimal';
  @Input() useGrouping = true;
  @Input() minFractionDigits = 0;
  @Input() maxFractionDigits = 2;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() disabled = false


  constructor() {
    super()
  }

  ngOnInit(): void { }
}
