import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtsAzureMapsComponent } from './azure-maps.component';

describe('NtsAzureMapsComponent', () => {
  let component: NtsAzureMapsComponent;
  let fixture: ComponentFixture<NtsAzureMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NtsAzureMapsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtsAzureMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
