/** This is the config for the Mortgage Calculator */
export interface MtgCalcConfig {
  /** Loan Amount Input */
  loanAmount?: number | null;
  /** Terms in years */
  terms?: number | null;
  /** interest rate as a yearly percent */
  interestRate?: number | null;
};

export interface PAndI {
  principle: number;
  interest: number;
  balance: number;
}