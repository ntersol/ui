import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';

import { MtgCalcComponent } from './mtg-calc.component';
import { DEFAULT } from './mtg-calc.constants';
import { Calculation, MtgCalcService } from '..';

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

let mtgSvcMock: any;

const finalData: Calculation = {
  loanAmount: 350000,
  terms: 360,
  interestRate: 3,
  amortization: [],
  firstMonthInterest: 0,
  firstMonthPrinciple: 0,
  totalPayment: 0,
  interestTotal: 0,
};

describe('MtgCalcComponent', () => {
  let component: MtgCalcComponent;
  let fixture: ComponentFixture<MtgCalcComponent>;

  beforeEach(async(() => {
    mtgSvcMock = {
      calculatePayments: jest.fn().mockReturnValue(finalData),
    };
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        ChartModule,
        InputNumberModule,
        TabViewModule,
      ],
      declarations: [MtgCalcComponent],
      providers: [{ provide: MtgCalcService, useValue: mtgSvcMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtgCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('config setter', () => {
    it('should set _config to default with no value passed in', () => {
      component.config = {};
      const DEF = DEFAULT;
      expect(component._config).toEqual(DEF);
    });

    it('should call calculatePayments', () => {
      component.calculatePayments = jest.fn();
      component.config = {};
      expect(component.calculatePayments).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculatePayments', () => {
    it('should call calculatePayments on MtgCalcService with params', () => {
      component.config = {};
      component.config.loanAmount = 123;
      component.config.interestRate = 456;
      component.config.terms = 890;
      component.calculatePayments();
      expect(mtgSvcMock.calculatePayments).toHaveBeenCalled();
    });
  });

  describe('onInputChange', () => {
    it('should call calculatePayments if autoCalculate is true', () => {
      component.config.autoCalculate = true;
      component.calculatePayments = jest.fn();
      component.onInputChange();
      expect(component.calculatePayments).toHaveBeenCalledTimes(1);
    });
    it('should NOT call calculatePayments if autoCalculate is false', () => {
      component.config.autoCalculate = false;
      component.calculatePayments = jest.fn();
      component.onInputChange();
      expect(component.calculatePayments).not.toHaveBeenCalled();
    });
  });

  describe('onTabChange', () => {
    it('should call calculatePayments after 100ms', fakeAsync(() => {
      component.onTabChange();
      component.calculatePayments = jest.fn();
      tick(100);
      expect(component.calculatePayments).toHaveBeenCalledTimes(1);
      discardPeriodicTasks();
    }));
  });

  describe('showDropdown', () => {
    it('should call show on termDropdownRef', () => {
      component.termDropdownRef = {
        show: jest.fn(),
      } as unknown as Dropdown;
      component.showDropdown();
      expect(component.termDropdownRef.show).toHaveBeenCalledTimes(1);
    });
    it('should NOT call show on termDropdownRef if it does not exist', () => {
      component.termDropdownRef = undefined as unknown as Dropdown;
      component.showDropdown();
      expect(component.termDropdownRef).toEqual(undefined);
    });
  });

  describe('toggleSchedule', () => {
    it('should toggle showAmortization', () => {
      component.showAmortization = true;
      component.toggleSchedule();
      expect(component.showAmortization).toEqual(false);
    });
  });
});
