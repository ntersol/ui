import { CommonModule, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { NtsDocumentEditorModule } from '@ntersol/document-editor';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsGooglePlacesAutocompleteModule } from '@ntersol/google-places-autocomplete';
import { NtsMtgCalcModule } from '@ntersol/mtg-calc';
import { NtsStateManagementModule } from '@ntersol/state-management';
import { NtsTableModule } from '@ntersol/table';
import { NtsTagsModule } from '@ntersol/tags';
import { NtsVisibleModule } from '@ntersol/visible';
import { NtsWizardModule } from '@ntersol/wizard';
import { TabViewModule } from 'primeng/tabview';
import { SiteModule } from '../../site.module';
// Components
import { ComponentsComponent } from './components.component';
// Routing
import { routing } from './routes';
import { DocEditorComponent } from './routes/doc-editor/doc-editor.component';
import { GooglePlacesAutocompleteComponent } from './routes/google-places-autocomplete/google-places-autocomplete.component';
import { MtgCalcComponent } from './routes/mtg-calc/mtg-calc.component';
import { ShowcaseTableComponent } from './routes/table/table.component';
import { ShowcaseTagsComponent } from './routes/tags/tags.component';
import { VisibleComponent } from './routes/visible/visible.component';
import { WizardComponent } from './routes/wizard/wizard.component';
import { FileUploaderComponent } from './routes/file-uploader/file-uploader.component';
import { NtsFileUploaderModule } from '@ntersol/file-uploader';

@NgModule({
  imports: [
    CommonModule,
    SiteModule,
    routing,
    NtsStateManagementModule,
    TabViewModule,
    NtsFormsModule,
    NtsTableModule,
    NtsTagsModule,
    NtsGooglePlacesAutocompleteModule,
    NtsMtgCalcModule,
    NtsVisibleModule,
    NtsDocumentEditorModule,
    NtsWizardModule,
    NtsFileUploaderModule,
  ],
  declarations: [
    ComponentsComponent,
    WizardComponent,
    MtgCalcComponent,
    VisibleComponent,
    ShowcaseTableComponent,
    ShowcaseTagsComponent,
    GooglePlacesAutocompleteComponent,
    DocEditorComponent,
    FileUploaderComponent,
  ],
  providers: [PathLocationStrategy],
  exports: [],
  entryComponents: [],
})
export class ComponentsModule {}
