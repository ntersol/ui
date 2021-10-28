import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { mergeDeepRight } from 'ramda';
import { MtgCalcConfig, PAndI } from './mtg-calc.model';
import { DEFAULT } from './mtg-calc.constants';

@Component({
  selector: 'nts-mtg-calc',
  templateUrl: './mtg-calc.component.html',
  styleUrls: ['./mtg-calc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MtgCalcComponent implements OnInit {
  _config: MtgCalcConfig = DEFAULT;
  showAmortization = false;
  amortization: Array<PAndI> = [];
  monthlyAmount = 0;

  get config(): MtgCalcConfig {
    return this._config;
  }

  @Input() set config(value: MtgCalcConfig) {
    this._config = mergeDeepRight(DEFAULT, value);
    this.calculatePayments();
  }

  ngOnInit(): void {
    this.calculatePayments();
  }

  calculatePayments(): void {
    let p = this.config.loanAmount;
    const l = this.config.terms;
    const i = this.config.interestRate;
    // M = P[r(1+r)^n/((1+r)^n)-1)]
    if (!!p && !!l && !!i && !isNaN(p) && !isNaN(l) && !isNaN(i)) {
      const j = i / 12 / 100;
      const n = l * 12;
      const m = p * j / (1 - Math.pow(1 + j, -n));
      this.monthlyAmount = m;
      this.amortization = [];
      let q = 1;
      let h = 1;
      let c = 1;
      while (p >= 0) {
        h = p * j;
        c = m - h;
        q = p - c;
        if (this.amortization.length < n) {
          this.amortization.push({
            principle: c,
            interest: h,
            balance: p
          });
        }
        p = q;
      }
    }
  }

  toggleSchedule(): void {
    this.showAmortization = !this.showAmortization;
  }

}
