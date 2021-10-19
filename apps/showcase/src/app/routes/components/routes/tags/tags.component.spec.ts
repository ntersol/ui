import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseTagsComponent } from './tags.component';

describe('TagsComponent', () => {
  let component: ShowcaseTagsComponent;
  let fixture: ComponentFixture<ShowcaseTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowcaseTagsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
