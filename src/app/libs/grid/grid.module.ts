import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';

import { TemplateRendererComponent } from './template-renderer/template-renderer.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([TemplateRendererComponent])
  ],
  declarations: [TemplateRendererComponent],
  exports: [AgGridModule, TemplateRendererComponent],
  
})
export class GridModule { }
