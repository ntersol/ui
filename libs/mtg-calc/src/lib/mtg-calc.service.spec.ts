import { TestBed } from '@angular/core/testing';
import { Calculation } from '..';

import { MtgCalcService } from './mtg-calc.service';

describe('MtgCalcService', () => {
  let service: MtgCalcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MtgCalcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculatePayments', () => {
    it(`should return 0's if loan amount is 0`, () => {
      const resp = service.calculatePayments(0, 5, 5);
      expect(resp.totalPayment).toEqual(0);
    });
    it(`should return 0's if terms is 0`, () => {
      const resp = service.calculatePayments(5, 0, 5);
      expect(resp.totalPayment).toEqual(0);
    });
    it(`should return 0's if interest is 0`, () => {
      const resp = service.calculatePayments(5, 5, 0);
      expect(resp.totalPayment).toEqual(0);
    });

    it('should set finalData correctly with calculations', () => {
      const finalData: Calculation = {
        loanAmount: 350000,
        terms: 30,
        interestRate: 5,
        firstMonthInterest: 1458.33,
        firstMonthPrinciple: 420.54,
        amortization: [],
        interestTotal: 326395.24,
        totalPayment: 676395.24,
      };
      const resp = service.calculatePayments(finalData.loanAmount, finalData.terms, finalData.interestRate);
      expect(resp.loanAmount).toEqual(finalData.loanAmount);
      expect(resp.amortization.length).toEqual(360);
      expect(resp.totalPayment).toEqual(finalData.totalPayment);
      expect(resp.interestTotal).toEqual(finalData.interestTotal);
      expect(resp.firstMonthInterest).toEqual(finalData.firstMonthInterest);
      expect(resp.firstMonthPrinciple).toEqual(finalData.firstMonthPrinciple);
    });
  });
});
