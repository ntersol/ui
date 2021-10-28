import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MtgCalcConfig, PAndI } from './mtg-calc.model';

@Component({
  selector: 'nts-mtg-calc',
  templateUrl: './mtg-calc.component.html',
  styleUrls: ['./mtg-calc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MtgCalcComponent implements OnInit {
  config: MtgCalcConfig = {
    loanAmount: 350000,
    terms: 30,
    interestRate: 5
  };
  showAmortization = false;
  amortization: Array<PAndI> = [];
  monthlyAmount = 0;

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
