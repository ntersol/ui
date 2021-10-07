import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formgroup2ApiComponent } from './formgroup2-api.component';

import { TabViewModule } from 'primeng/tabview';

describe('Formgroup2ApiComponent', () => {
  let component: Formgroup2ApiComponent;
  let fixture: ComponentFixture<Formgroup2ApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Formgroup2ApiComponent],
      imports: [TabViewModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Formgroup2ApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
