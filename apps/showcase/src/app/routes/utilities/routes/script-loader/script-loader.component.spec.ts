import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabViewModule } from 'primeng/tabview';
import { ScriptLoaderComponent } from './script-loader.component';

describe('ScriptLoaderComponent', () => {
  let component: ScriptLoaderComponent;
  let fixture: ComponentFixture<ScriptLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScriptLoaderComponent],
      imports: [TabViewModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
