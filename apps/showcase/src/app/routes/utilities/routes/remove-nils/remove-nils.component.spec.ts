import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabViewModule } from 'primeng/tabview';
import { RemoveNilsComponent } from './remove-nils.component';

describe('RemoveNilsComponent', () => {
  let component: RemoveNilsComponent;
  let fixture: ComponentFixture<RemoveNilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabViewModule],
      declarations: [RemoveNilsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveNilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
