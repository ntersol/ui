import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { UiStoreCreatorComponent } from './ui-store-creator.component';
import { TabViewModule } from 'primeng/tabview';

describe('UiStoreCreatorComponent', () => {
  let component: UiStoreCreatorComponent;
  let fixture: ComponentFixture<UiStoreCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiStoreCreatorComponent],
      imports: [HttpClientTestingModule, TabViewModule, FormsModule]
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
