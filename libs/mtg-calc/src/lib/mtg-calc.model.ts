/** This is the config for the Mortgage Calculator */
export interface MtgCalcConfig {
  loanAmount: number;
  terms: number;
  interestRate: number;
};

export interface PAndI {
  principle: number;
  interest: number;
  balance: number;
}