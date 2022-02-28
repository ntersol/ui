import { Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { mergeDeepRight } from 'ramda';
import { MtgCalcConfig, PAndI } from './mtg-calc.model';
import { DEFAULT } from './mtg-calc.constants';
import { ChartConfiguration } from 'chart.js';
import { MtgCalcService } from './mtg-calc.service';
import { UIChart } from 'primeng/chart';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'nts-mtg-calc',
  templateUrl: './mtg-calc.component.html',
  styleUrls: ['./mtg-calc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MtgCalcComponent {
  _config = DEFAULT;
  monthlyChart!: ChartConfiguration;
  totalPayment = 0;
  showAmortization = false;
  amortization: Array<PAndI> = [];
  monthlyAmount = 0;

  get config(): MtgCalcConfig {
    return this._config;
  }

  @Input() set config(value: MtgCalcConfig) {
    this._config = mergeDeepRight(DEFAULT, value) as MtgCalcConfig;
    if (this._config.chartOptions) {
      this.monthlyChart = JSON.parse(JSON.stringify(this._config.chartOptions));
    }
    this.calculatePayments();
  }

  @ViewChild('termDropdownRef') termDropdownRef!: Dropdown;
  @ViewChild('pieChart') pieChart!: UIChart;
  @ViewChild('monthlyPieChart') monthlyPieChart!: UIChart;

  constructor(private mtgSvc: MtgCalcService) {}

  calculatePayments(): void {
    if (
      !!this.config.loanAmount &&
      !!this.config.terms &&
      !!this.config.interestRate &&
      !isNaN(this.config.loanAmount) &&
      !isNaN(this.config.terms) &&
      !isNaN(this.config.interestRate)
    ) {
      const finalData = this.mtgSvc.calculatePayments(
        this.config.loanAmount,
        this.config.terms,
        this.config.interestRate,
      );
      this.amortization = finalData.amortization;
      this.totalPayment = finalData.totalPayment;
      this.monthlyAmount = finalData.firstMonthInterest + finalData.firstMonthPrinciple;
      if (this.config.showChart) {
        if (this.config.chartOptions) {
          this.config.chartOptions.data.datasets[0].data = [finalData.loanAmount, finalData.interestTotal];
        }
        this.monthlyChart.data.datasets[0].data = [finalData.firstMonthPrinciple, finalData.firstMonthInterest];
        if (this.monthlyPieChart) {
          this.monthlyPieChart.refresh();
        }
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

  onTabChange(): void {
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
