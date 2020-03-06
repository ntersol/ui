import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

import { EditorComponent } from './components/editor/editor.component';
import { DocumentComponent } from './components/document/document.component';
import { DocumentEditorService } from './shared/document-editor.service';
import { ViewerComponent } from './components/viewer/viewer.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PageComponent } from './components/page/page.component';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [EditorComponent, ViewerComponent, ToolbarComponent, PageComponent, DocumentComponent],
  imports: [CommonModule, TabViewModule, ButtonModule, ProgressBarModule, CardModule],
  providers: [DocumentEditorService],
  exports: [EditorComponent],
})
export class NtsDocumentEditorModule {}
