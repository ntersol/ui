import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { of } from 'rxjs';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { StoreCommunicationComponent } from './store-communication.component';
import { StoreComsService } from './store-communication.service';

describe('StoreCommunicationComponent', () => {
  let component: StoreCommunicationComponent;
  let fixture: ComponentFixture<StoreCommunicationComponent>;

  const storeComsServiceMock = {
    uiStore: {
      select$: jest.fn().mockReturnValue(of('123')),
      dispatch: jest.fn(),
    },
  };

  const highlightServiceMock = {
    highlightAll: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabViewModule, FormsModule],
      providers: [
        { provide: StoreComsService, useValue: storeComsServiceMock },
        { provide: HighlightService, useValue: highlightServiceMock },
      ],
      declarations: [StoreCommunicationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
