import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { UiStoreCreatorComponent } from './ui-store-creator.component';
import { TabViewModule } from 'primeng/tabview';
import { StateManagementService } from '../../shared/state-management.service';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { of } from 'rxjs';

describe('UiStoreCreatorComponent', () => {
  let component: UiStoreCreatorComponent;
  let fixture: ComponentFixture<UiStoreCreatorComponent>;

  const stateManagementServiceMock = {
    uiStore: {
      select$: jest.fn().mockReturnValueOnce(of('test')).mockReturnValueOnce(of({ user: { age: 30 } })),
      update: jest.fn(),
    }
  };

  const highlightServiceMock = {
    highlightAll: jest.fn(),
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiStoreCreatorComponent],
      imports: [HttpClientTestingModule, TabViewModule, FormsModule],
      providers: [
        { provide: StateManagementService, useValue: stateManagementServiceMock },
        { provide: HighlightService, useValue: highlightServiceMock },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiStoreCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
