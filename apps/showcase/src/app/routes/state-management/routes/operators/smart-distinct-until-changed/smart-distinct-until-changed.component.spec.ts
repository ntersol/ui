import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartDistinctUntilChangedComponent } from './smart-distinct-until-changed.component';

describe('SmartDistinctUntilChangedComponent', () => {
  let component: SmartDistinctUntilChangedComponent;
  let fixture: ComponentFixture<SmartDistinctUntilChangedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartDistinctUntilChangedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartDistinctUntilChangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
