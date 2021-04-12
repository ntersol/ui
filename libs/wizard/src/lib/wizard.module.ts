import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { WizardComponent } from './components/wizard/wizard.component';
import { SectionComponent } from './components/section/section.component';
import { PageComponent } from './components/page/page.component';
import { ContentComponent } from './components/content/content.component';
import { NtsFormsModule } from '../../../forms/src/lib/forms.module';
import { WizNavSidebarComponent } from './components/widgets/nav-sidebar/nav-sidebar.component';
import { WizNavTopComponent } from './components/widgets/nav-top/nav-top.component';
import { WizardFeatureDirective } from './shared/directives/feature.directive';
import { WizardFeatureTemplateDirective } from './shared/directives/feature-template.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';

const DEPS = [
  WizardComponent,
  WizNavSidebarComponent,
  WizNavTopComponent,
  WizardFeatureDirective,
  WizardFeatureTemplateDirective,
];

@NgModule({
  declarations: [SectionComponent, PageComponent, ContentComponent, DEPS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressBarModule,
    NtsFormsModule,
    CheckboxModule,
    MultiSelectModule,
  ],
  exports: [DEPS],
})
export class NtsWizardModule {}
