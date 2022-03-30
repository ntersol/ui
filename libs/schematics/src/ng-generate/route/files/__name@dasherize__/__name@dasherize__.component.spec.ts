import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { <%= classify(name)%>Component } from './<%= dasherize(name)%>.component';

describe('<%= classify(name)%>Component', () => {
  let component: <%= classify(name)%>Component;
  let fixture: ComponentFixture<<%= classify(name)%>Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [<%= classify(name)%>Component],
      imports: [
        HttpClientTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(<%= classify(name)%>Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
