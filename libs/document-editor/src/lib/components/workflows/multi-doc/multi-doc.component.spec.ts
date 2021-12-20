import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDocComponent } from './multi-doc.component';

describe('MultiDocComponent', () => {
  let component: MultiDocComponent;
  let fixture: ComponentFixture<MultiDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
