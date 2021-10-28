import { MtgCalcConfig } from "..";

export const DEFAULT: MtgCalcConfig = {
    loanAmount: 350000,
    terms: 30,
    interestRate: 5,
    termOptions: [{
        name: '15 Years',
        value: 15
    }, {
        name: '30 Years',
        value: 30
    }]
}