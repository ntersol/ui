import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagBuilderComponent } from './tag-builder.component';

describe('TagBuilderComponent', () => {
  let component: TagBuilderComponent;
  let fixture: ComponentFixture<TagBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
