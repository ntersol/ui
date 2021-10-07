import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { NtsServiceWorkerService, NtsVersionManagementService } from './shared/services/general';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MockComponent, MockProvider } from 'ng-mocks';

describe('AppComponent', () => {
  let mockNtsServiceWorkerService = {
    pollforUpdates: jest.fn()
  };
  mockNtsServiceWorkerService.pollforUpdates.mockReturnValue(null);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MockComponent(ConfirmDialog)],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        MockProvider(NtsVersionManagementService),
        {
          provide: NtsServiceWorkerService,
          useValue: mockNtsServiceWorkerService
        }
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
