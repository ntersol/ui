import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibLoaderComponent } from './lib-loader.component';

describe('LibLoaderComponent', () => {
  let component: LibLoaderComponent;
  let fixture: ComponentFixture<LibLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
