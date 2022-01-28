import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NtsTableModule } from '@ntersol/table';
import { TabViewModule } from 'primeng/tabview';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { ShowcaseTableComponent } from './table.component';

describe('ShowcaseTableComponent', () => {
  let component: ShowcaseTableComponent;
  let fixture: ComponentFixture<ShowcaseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowcaseTableComponent],
      imports: [TabViewModule, NtsTableModule],
      providers: [HighlightService],
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
