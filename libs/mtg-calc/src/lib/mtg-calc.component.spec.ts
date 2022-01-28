import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtgCalcComponent } from './mtg-calc.component';

describe('MtgCalcComponent', () => {
  let component: MtgCalcComponent;
  let fixture: ComponentFixture<MtgCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MtgCalcComponent],
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
});
