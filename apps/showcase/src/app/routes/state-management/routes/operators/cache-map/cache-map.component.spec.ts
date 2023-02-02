import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheMapComponent } from './cache-map.component';

describe('CacheMapComponent', () => {
  let component: CacheMapComponent;
  let fixture: ComponentFixture<CacheMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CacheMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
