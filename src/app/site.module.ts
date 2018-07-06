import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiToolsModule } from '@mello-labs/api-tools';
import { FormToolsModule } from '@mello-labs/form-tools';

import { SharedModule } from '$shared';
import { ComponentsModule } from '$components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // Vendors
    NgbModule.forRoot(),
    // Mello Labs Tools
    ApiToolsModule.forRoot(),
    FormToolsModule.forRoot(),
    // Global components
    ComponentsModule.forRoot(),
    // Global shared
    SharedModule.forRoot(),
  ],
  declarations: [],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ApiToolsModule,
    FormToolsModule,
    SharedModule,
    ComponentsModule,
  ],
})
export class SiteModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SiteModule,
      providers: [],
    };
  }
}
