import { TestBed } from '@angular/core/testing';

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
  });
});
