import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseTableComponent } from './table.component';

import { NtsTableModule } from '@ntersol/table';
import { TabViewModule } from 'primeng/tabview';

describe('ShowcaseTableComponent', () => {
  let component: ShowcaseTableComponent;
  let fixture: ComponentFixture<ShowcaseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowcaseTableComponent],
      imports: [TabViewModule, NtsTableModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
