/** This is the config for the Mortgage Calculator */
export interface MtgCalcConfig {
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
};

export interface PAndI {
  principle: number;
  interest: number;
  balance: number;
};

export interface TermOptions {
  name: string;
  value: number;
};