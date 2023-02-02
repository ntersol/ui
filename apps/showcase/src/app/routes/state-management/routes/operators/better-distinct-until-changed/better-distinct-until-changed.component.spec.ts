import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetterDistinctUntilChangedComponent } from './better-distinct-until-changed.component';

describe('BetterDistinctUntilChangedComponent', () => {
  let component: BetterDistinctUntilChangedComponent;
  let fixture: ComponentFixture<BetterDistinctUntilChangedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetterDistinctUntilChangedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetterDistinctUntilChangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
