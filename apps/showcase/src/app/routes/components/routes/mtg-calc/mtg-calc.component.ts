import { Component, ChangeDetectionStrategy, AfterViewInit, OnInit } from '@angular/core';
import { MtgCalcConfig } from '@ntersol/mtg-calc';
import { ChartTypeRegistry } from 'chart.js';
import { HighlightService } from '../../../../shared/services/highlight.service';
interface LoanOptions {
  name: string;
  value: number | string;
}

@Component({
  selector: 'app-mtg-calc',
  templateUrl: './mtg-calc.component.html',
  styleUrls: ['./mtg-calc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MtgCalcComponent implements OnInit, AfterViewInit {
  config!: MtgCalcConfig;
  background1: string = '#6c757d';
  background2: string = '#ff6600';
  background3: string = '#b4babe';
  background4: string = '#ffb27f';
  chartTypes: LoanOptions[] = [
    {
      name: 'Doughnut',
      value: 'doughnut',
    },
    {
      name: 'Pie',
      value: 'pie',
    },
  ];
  selectedChartType: string = 'doughnut';
  loanOptions: LoanOptions[] = [
    {
      name: '15 and 30 years',
      value: 1,
    },
    {
      name: '1 to 30 years',
      value: 2,
    },
  ];
  selectedLoanOptions: number = 1;
  public exampleTSInstall = `
  // You must have the chart.js npm package
  npm i chart.js
  // Install the mtg-calc library
  npm i @ntersol/mtg-calc`;

  public html = this.highlight.htmlEncode(`
  <nts-mtg-calc [config]="config"></nts-mtg-calc>  `);

  public exampleTS = this.highlight.htmlEncode(
    `
    // Optionally Import config type to provide customizations
    import { NtsMtgCalc } from '@ntersol/mtg-calc';

    // Default config is as follows
    export const DEFAULT: MtgCalcConfig = {
      autoCalculate: false,
      chartOptions: {
        type: 'doughnut',
        data: {
          labels: ['Principle', 'Interest'],
          datasets: [
            {
              data: [350000, 215796.31],
              backgroundColor: ['#6c757d', '#ff6600'],
              hoverBackgroundColor: ['#b4babe', '#ffb27f'],
            },
          ],
        },
      },
      interestRate: 5,
      loanAmount: 350000,
      termOptions: [
        {
          name: '15 Years',
          value: 15,
        },
        {
          name: '30 Years',
          value: 30,
        },
      ],
      terms: 30,
      showAmortization: true,
      showChart: true,
      showTotal: false,
    };

    `,
  );
  constructor(private highlight: HighlightService) {}

  ngOnInit(): void {
    this.config = {
      autoCalculate: false,
      chartOptions: {
        type: 'doughnut',
        data: {
          labels: ['Principle', 'Interest'],
          datasets: [
            {
              data: [350000, 215796.31],
              backgroundColor: ['#6c757d', '#ff6600'],
              hoverBackgroundColor: ['#b4babe', '#ffb27f'],
            },
          ],
        },
      },
      interestRate: 5,
      loanAmount: 350000,
      termOptions: [
        {
          name: '15 Years',
          value: 15,
        },
        {
          name: '30 Years',
          value: 30,
        },
      ],
      terms: 30,
      showAmortization: true,
      showChart: true,
      showTotal: false,
    };
  }

  ngAfterViewInit(): void {
    this.doHighlight();
  }

  doHighlight(): void {
    this.highlight.highlightAll();
  }

  onChange(): void {
    const config = { ...this.config };
    this.config = config;
    this.doHighlight();
  }

  onChartOptionsChange() {
    const config = { ...this.config };
    if (config && config.chartOptions && config.chartOptions.data.datasets.length == 1) {
      config.chartOptions.data.datasets[0].backgroundColor = [this.background1, this.background2];
      config.chartOptions.data.datasets[0].hoverBackgroundColor = [this.background3, this.background4];
    }
    this.config = config;
    this.doHighlight();
  }

  onChartTypesChange(): void {
    const config = { ...this.config };
    if (config && config.chartOptions) {
      config.chartOptions.type = this.selectedChartType as keyof ChartTypeRegistry;
    }
    this.config = config;
    this.doHighlight();
  }

  onLoanOptionsChange() {
    const config = { ...this.config };
    if (this.selectedLoanOptions == 1) {
      config.termOptions = [
        {
          name: '15 Years',
          value: 15,
        },
        {
          name: '30 Years',
          value: 30,
        },
      ];
    } else {
      config.termOptions = [
        {
          name: '1 year',
          value: 1,
        },
        {
          name: '2 years',
          value: 2,
        },
        {
          name: '3 years',
          value: 3,
        },
        {
          name: '4 years',
          value: 4,
        },
        {
          name: '5 years',
          value: 5,
        },
        {
          name: '6 years',
          value: 6,
        },
        {
          name: '7 years',
          value: 7,
        },
        {
          name: '8 years',
          value: 8,
        },
        {
          name: '9 years',
          value: 9,
        },
        {
          name: '10 years',
          value: 10,
        },
        {
          name: '11 years',
          value: 11,
        },
        {
          name: '12 years',
          value: 12,
        },
        {
          name: '13 years',
          value: 13,
        },
        {
          name: '14 years',
          value: 14,
        },
        {
          name: '15 years',
          value: 15,
        },
        {
          name: '16 years',
          value: 16,
        },
        {
          name: '17 years',
          value: 17,
        },
        {
          name: '18 years',
          value: 18,
        },
        {
          name: '19 years',
          value: 19,
        },
        {
          name: '20 years',
          value: 20,
        },
        {
          name: '21 years',
          value: 21,
        },
        {
          name: '22 years',
          value: 22,
        },
        {
          name: '23 years',
          value: 23,
        },
        {
          name: '24 years',
          value: 24,
        },
        {
          name: '25 years',
          value: 25,
        },
        {
          name: '26 years',
          value: 26,
        },
        {
          name: '27 years',
          value: 27,
        },
        {
          name: '28 years',
          value: 28,
        },
        {
          name: '29 years',
          value: 29,
        },
        {
          name: '30 Years',
          value: 30,
        },
      ];
    }
    this.config = config;
    this.doHighlight();
  }
}
