import { Injectable } from '@angular/core';
import { Calculation } from '..';

@Injectable({
  providedIn: 'root',
})
export class MtgCalcService {
  calculatePayments(p: number, l: number, i: number): Calculation {
    const finalData: Calculation = {
      loanAmount: p,
      terms: l,
      interestRate: i,
      amortization: [],
      firstMonthInterest: 0,
      firstMonthPrinciple: 0,
      totalPayment: 0,
      interestTotal: 0,
    };
    if (!p || !l || !i) {
      return finalData;
    }
    // M = P[r(1+r)^n/((1+r)^n)-1)]
    const j = i / 12 / 100;
    const n = l * 12;
    const m = (p * j) / (1 - Math.pow(1 + j, -n));
    let q = 1;
    let h = 1;
    let c = 1;
    let interestTotal = 0;
    let index = 1;
    while (p >= 0) {
      h = p * j;
      c = m - h;
      q = p - c;
      if (index === 1) {
        finalData.firstMonthPrinciple = parseFloat(c.toFixed(2));
        finalData.firstMonthInterest = parseFloat(h.toFixed(2));
      }
      if (finalData.amortization.length < n) {
        interestTotal += h;
        finalData.amortization.push({
          principle: c,
          interest: h,
          balance: p,
        });
      }
      p = q;
      index++;
    }
    finalData.totalPayment = finalData.loanAmount + parseFloat(interestTotal.toFixed(2));
    finalData.interestTotal = parseFloat(interestTotal.toFixed(2));
    return finalData;
  }
}
