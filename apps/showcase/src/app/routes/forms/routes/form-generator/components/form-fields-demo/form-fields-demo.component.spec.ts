import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldsDemoComponent } from './form-fields-demo.component';

describe('FormFieldsDemoComponent', () => {
  let component: FormFieldsDemoComponent;
  let fixture: ComponentFixture<FormFieldsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFieldsDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
