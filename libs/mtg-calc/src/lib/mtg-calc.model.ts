import { ChartConfiguration } from 'chart.js';

/** This is the config for the Mortgage Calculator */
export interface MtgCalcConfig {
  /** Auto calculate on input change */
  autoCalculate?: boolean;
  /** Chart options from chart.js */
  chartOptions?: ChartConfiguration;
  /** interest rate as a yearly percent */
  interestRate?: number | null;
  /** Loan Amount Input */
  loanAmount?: number | null;
  /** Displays the show amortization schedule button */
  showAmortization?: boolean | null;
  /** term options dropdown values */
  termOptions?: Array<TermOptions>;
  /** Terms in years */
  terms?: number | null;
  /** Show pie chart or not */
  showChart?: boolean;
  /** Show the total cost or not */
  showTotal?: boolean;
}

export interface PAndI {
  principle: number;
  interest: number;
  balance: number;
}

export interface TermOptions {
  name: string;
  value: number;
}

export interface Calculation {
  loanAmount: number;
  terms: number;
  interestRate: number;
  amortization: PAndI[];
  firstMonthPrinciple: number;
  firstMonthInterest: number;
  totalPayment: number;
  interestTotal: number;
}
