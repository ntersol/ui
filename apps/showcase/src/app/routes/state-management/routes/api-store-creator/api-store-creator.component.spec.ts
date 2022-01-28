import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
import { NtsTableModule } from '@ntersol/table';
import { TabViewModule } from 'primeng/tabview';
import { ExampleComponent } from '../../../../routes/state-management/components/example.component';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { ApiStoreCreatorComponent } from './api-store-creator.component';

describe('ApiStoreCreatorComponent', () => {
  let component: ApiStoreCreatorComponent;
  let fixture: ComponentFixture<ApiStoreCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiStoreCreatorComponent, ExampleComponent],
      imports: [
        TabViewModule,
        HttpClientTestingModule,
        NtsFormsModule,
        NtsTableModule,
        ReactiveFormsModule,
        NtsStateManagementModule,
      ],
      providers: [HighlightService, FormBuilder],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiStoreCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
