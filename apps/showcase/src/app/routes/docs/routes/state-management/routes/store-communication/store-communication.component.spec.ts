import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCommunicationComponent } from './store-communication.component';

describe('StoreCommunicationComponent', () => {
  let component: StoreCommunicationComponent;
  let fixture: ComponentFixture<StoreCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreCommunicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
