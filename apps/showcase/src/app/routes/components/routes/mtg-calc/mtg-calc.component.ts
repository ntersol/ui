import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MtgCalcConfig } from '@ntersol/mtg-calc';

@Component({
  selector: 'app-mtg-calc',
  templateUrl: './mtg-calc.component.html',
  styleUrls: ['./mtg-calc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MtgCalcComponent implements OnInit {
  config: MtgCalcConfig = {
    loanAmount: 350000,
    terms: 30,
    interestRate: 3.5
  };
  constructor() { }

  ngOnInit() {
  }

}
