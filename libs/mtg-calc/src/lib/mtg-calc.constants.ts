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
}