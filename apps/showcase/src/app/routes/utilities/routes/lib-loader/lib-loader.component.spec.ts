import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabViewModule } from 'primeng/tabview';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { LibLoaderComponent } from './lib-loader.component';

describe('LibLoaderComponent', () => {
  let component: LibLoaderComponent;
  let fixture: ComponentFixture<LibLoaderComponent>;

  const highlightServiceMock = {
    highlightAll: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabViewModule],
      declarations: [LibLoaderComponent],
      providers: [{ provide: HighlightService, useValue: highlightServiceMock }],
    }).compileComponents();
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
