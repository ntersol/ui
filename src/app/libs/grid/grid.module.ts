import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';

import { GridTemplateRendererComponent } from './grid-template-renderer/grid-template-renderer.component';
import { GridStatusBarComponent } from './grid-status-bar/grid-status-bar.component';
import { TextCasePipe } from './pipes/text-case.pipe';

@NgModule({
  imports: [CommonModule, AgGridModule.withComponents([GridTemplateRendererComponent])],
  declarations: [GridTemplateRendererComponent, GridStatusBarComponent, TextCasePipe],
  exports: [AgGridModule, GridTemplateRendererComponent, GridStatusBarComponent],
  entryComponents: [GridStatusBarComponent],
})
export class GridModule {}
