import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TabViewModule } from 'primeng/tabview';
import { of } from 'rxjs';
import { NtsServiceWorkerService } from '../../../../shared/services/general';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { ServiceWorkerComponent } from './service-worker.component';

describe('ServiceWorkerComponent', () => {
  let component: ServiceWorkerComponent;
  let fixture: ComponentFixture<ServiceWorkerComponent>;

  const ntsServiceWorkerServiceMock = {
    pollforUpdates: jest.fn(),
    updateAvailable$: of(true),
    requestPermission: jest.fn(),
    pushSubscriptionCreate: jest.fn(),
    pushSubscription$: of(null),
    pushSubscriptionRemove: jest.fn(),
    remove: jest.fn(),
  };

  const highlightServiceMock = {
    highlightAll: jest.fn(),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TabViewModule],
      declarations: [ServiceWorkerComponent],
      providers: [
        { provide: NtsServiceWorkerService, useValue: ntsServiceWorkerServiceMock },
        { provide: HighlightService, useValue: highlightServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
