import { MtgCalcConfig } from "..";

export const DEFAULT: MtgCalcConfig = {
  interestRate: 5,
  loanAmount: 350000,
  showAmortization: true,
  termOptions: [{
    name: '15 Years',
    value: 15
  }, {
    name: '30 Years',
    value: 30
  }],
  terms: 30,
  showChart: true,
  chartOptions: {
    type: 'pie',
    data: {
      labels: ['Principle', 'Interest'],
      datasets: [
        {
          data: [350000, 215796.31],
          backgroundColor: [
            "#6c757d",
            "#ff6600",
          ],
          hoverBackgroundColor: [
            "#b4babe",
            "#ffb27f",
          ]
        }
      ]
    }
  }
}