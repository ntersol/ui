import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatagridModule } from '@mello-labs/datagrid';

/**
 * Lazy loaded library example. This library will be bundled indepedently and loaded on demand
 *
 * For lazy loaded libraries, be sure to add a reference in angular.json in
 * projects > architect > build > options > lazyModules
 */
@NgModule({
  imports: [CommonModule, DatagridModule],
  declarations: [],
  exports: [DatagridModule],
})
export class DatagridLazyModule {}
