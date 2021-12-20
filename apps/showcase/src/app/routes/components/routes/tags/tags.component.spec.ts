import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TabViewModule } from 'primeng/tabview';
import { ShowcaseTagsComponent } from './tags.component';
import { NtsTagsModule } from '@ntersol/tags';

describe('TagsComponent', () => {
  let component: ShowcaseTagsComponent;
  let fixture: ComponentFixture<ShowcaseTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TabViewModule, NtsTagsModule],
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
