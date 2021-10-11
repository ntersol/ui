import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ExampleComponent } from './example.component';
import { NtsTableModule } from '@ntersol/table';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
import { NtsVersionManagementService, NtsServiceWorkerService } from '../../../../../shared/services/general';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExampleComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, NtsFormsModule, NtsTableModule, NtsStateManagementModule],
      providers: [FormBuilder, {
        provide: NtsVersionManagementService,
        useValue: null
      },
        {
          provide: NtsServiceWorkerService,
          useValue: null
        }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
