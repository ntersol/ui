import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabViewModule } from 'primeng/tabview';

import { CacheMapComponent } from './cache-map.component';

describe('CacheMapComponent', () => {
  let component: CacheMapComponent;
  let fixture: ComponentFixture<CacheMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CacheMapComponent],
      imports: [HttpClientTestingModule, TabViewModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CacheMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
