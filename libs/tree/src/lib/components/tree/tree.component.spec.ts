import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NtsTreeComponent } from './tree.component';
import { TreeModule } from 'primeng/tree';

describe('NtsTreeComponent', () => {
  let component: NtsTreeComponent;
  let fixture: ComponentFixture<NtsTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NtsTreeComponent],
      imports: [TreeModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
