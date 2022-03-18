import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { SiteModule } from '../../site.module';
import { SchematicsRoutingModule } from './schematics-routing.module';
import { SchematicsComponent } from './schematics.component';

@NgModule({
  imports: [CommonModule, SiteModule, TabViewModule, SchematicsRoutingModule],
  declarations: [SchematicsComponent],
})
export class SchematicsModule {}
