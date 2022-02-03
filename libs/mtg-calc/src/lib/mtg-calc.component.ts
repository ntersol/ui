import { Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { mergeDeepRight } from 'ramda';
import { MtgCalcConfig, PAndI } from './mtg-calc.model';
import { DEFAULT } from './mtg-calc.constants';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'nts-mtg-calc',
  templateUrl: './mtg-calc.component.html',
  styleUrls: ['./mtg-calc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MtgCalcComponent {
  _config = DEFAULT;
  monthlyChart!: ChartConfiguration;
  totalPayment: number = 0;
  showAmortization = false;
  amortization: Array<PAndI> = [];
  monthlyAmount = 0;

  get config(): MtgCalcConfig {
    return this._config;
  }

  @Input() set config(value: MtgCalcConfig) {
    this._config = mergeDeepRight(DEFAULT, value) as MtgCalcConfig;
    if (this._config.chartOptions) {
      this.monthlyChart = mergeDeepRight({}, this._config.chartOptions);
    }
    this.calculatePayments();
  }

  @ViewChild('termDropdownRef') termDropdownRef: any;
  @ViewChild('pieChart') pieChart: any;
  @ViewChild('monthlyPieChart') monthlyPieChart: any;

  constructor() {}

  calculatePayments(): void {
    let p = this.config.loanAmount;
    const l = this.config.terms;
    const i = this.config.interestRate;
    // M = P[r(1+r)^n/((1+r)^n)-1)]
    if (!!p && !!l && !!i && !isNaN(p) && !isNaN(l) && !isNaN(i)) {
      const j = i / 12 / 100;
      const n = l * 12;
      const m = (p * j) / (1 - Math.pow(1 + j, -n));
      this.monthlyAmount = m;
      this.amortization = [];
      let q = 1;
      let h = 1;
      let c = 1;
      let interestTotal = 0;
      let index = 1;
      while (p >= 0) {
        h = p * j;
        c = m - h;
        q = p - c;
        if (this.config.showChart && index === 1) {
          this.monthlyChart.data.datasets[0].data = [parseFloat(c.toFixed(2)), parseFloat(h.toFixed(2))];
          if (this.monthlyPieChart) {
            this.monthlyPieChart.refresh();
          }
        }
        if (this.amortization.length < n) {
          interestTotal += h;
          this.amortization.push({
            principle: c,
            interest: h,
            balance: p,
          });
        }
        p = q;
        index++;
      }
      this.totalPayment = (this.config.loanAmount || 0) + parseFloat(interestTotal.toFixed(2));
      if (this.config.showChart && this.config.chartOptions) {
        this.config.chartOptions.data.datasets[0].data = [
          this.config.loanAmount || 0,
          parseFloat(interestTotal.toFixed(2)),
        ];
        if (this.pieChart) {
          this.pieChart.refresh();
        }
      }
    }
  }

  onInputChange(): void {
    if (this.config.autoCalculate) {
      this.calculatePayments();
    }
  }

  onTabChange(e: any): void {
    setTimeout(() => {
      this.calculatePayments();
    }, 100);
  }

  showDropdown(): void {
    if (!this.termDropdownRef) {
      return;
    }
    this.termDropdownRef.show();
  }

  toggleSchedule(): void {
    this.showAmortization = !this.showAmortization;
  }
}
