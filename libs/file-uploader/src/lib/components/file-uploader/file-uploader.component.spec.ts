import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabViewModule } from 'primeng/tabview';

import { NtsFileUploaderComponent } from './file-uploader.component';

describe('FileUploaderComponent', () => {
  let component: NtsFileUploaderComponent;
  let fixture: ComponentFixture<NtsFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NtsFileUploaderComponent],
      imports: [TabViewModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NtsFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
