import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiStoreCreatorComponent } from './ui-store-creator.component';

describe('UiStoreCreatorComponent', () => {
  let component: UiStoreCreatorComponent;
  let fixture: ComponentFixture<UiStoreCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiStoreCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiStoreCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
