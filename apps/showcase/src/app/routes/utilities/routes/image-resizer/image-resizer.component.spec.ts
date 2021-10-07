import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageResizerComponent } from './image-resizer.component';

import { TabViewModule } from 'primeng/tabview';
import { FormsModule } from '@angular/forms';

describe('ImageResizerComponent', () => {
  let component: ImageResizerComponent;
  let fixture: ComponentFixture<ImageResizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageResizerComponent],
      imports: [TabViewModule, FormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageResizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
