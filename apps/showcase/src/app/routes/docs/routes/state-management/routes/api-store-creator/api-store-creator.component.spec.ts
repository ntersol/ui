import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStoreCreatorComponent } from './api-store-creator.component';

describe('ApiStoreCreatorComponent', () => {
  let component: ApiStoreCreatorComponent;
  let fixture: ComponentFixture<ApiStoreCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiStoreCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiStoreCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
