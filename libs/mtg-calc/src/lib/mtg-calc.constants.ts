import { MtgCalcConfig } from '..';

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
