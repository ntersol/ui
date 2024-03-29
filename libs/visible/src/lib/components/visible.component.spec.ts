import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleComponent } from './visible.component';

describe('VisibleComponent', () => {
  let component: VisibleComponent;
  let fixture: ComponentFixture<VisibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisibleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
