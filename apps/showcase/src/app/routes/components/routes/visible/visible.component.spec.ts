import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabViewModule } from 'primeng/tabview';
import { VisibleComponent } from './visible.component';

describe('VisibleComponent', () => {
  let component: VisibleComponent;
  let fixture: ComponentFixture<VisibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisibleComponent],
      imports: [TabViewModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
