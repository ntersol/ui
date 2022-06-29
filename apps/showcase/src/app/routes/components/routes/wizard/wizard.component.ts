import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsWizard } from '@ntersol/wizard';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-wizard-showcase',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent implements OnInit, AfterViewInit {
  public install = `
  npm i @ntersol/wizard --save
  npm i @ntersol/forms --save`;
  public import = `
  import { NtsWizardModule } from '@ntersol/wizard';`;
  public import2 = `
  @NgModule({
    imports: [..., NtsWizardModule],
    ...
  })
  export class MyModule {}`;

  public usage = `
// HTML Template
&lt;nts-wizard
  [form]=&quot;formGroup&quot;
  [sections]=&quot;sections&quot;
  [pages]=&quot;pages&quot;
  [routes]=&quot;routes&quot;
  (ready)=&quot;ready()&quot;
  (complete)=&quot;complete()&quot;
&gt;
&lt;/nts-wizard&gt;`;

  public settings: NtsWizard.Settings = {
    stickyFooter: false,
    buttonsNav: {
      prev: {
        label: 'Back',
        icon: null,
      },
      next: {
        label: 'Next',
        classes: 'btn btn-primary',
      },
    },
    pageTitle: {
      append: ' | Ntersol Wizard',
    },
  };

  public sections: NtsWizard.Section[] = [
    {
      title: 'Intro',
      urlSlug: 'intro',
      routeStart: 'start',
    },
  ];
  public pages: NtsWizard.Page[] = [
    {
      id: 'start',
      sectionId: 'intro',
      content: [
        {
          type: 'html',
          html: '<h1>Welcome</h1>',
        },
      ],
    },
  ];
  public routes: NtsWizard.Route[] = [
    {
      sectionId: 'intro',
      urlSlug: 'start',
      pageId: 'start',
      sectionComplete: true,
    },
  ];
  public formGroup = this.fb.group({});

  constructor(private highlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
