import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { HighlightService } from '../../shared/services/highlight.service';
import { SiteModule } from '../../site.module';
import { SchematicsRoutingModule } from './schematics-routing.module';
import { SchematicsComponent } from './schematics.component';

@NgModule({
  imports: [CommonModule, SiteModule, TabViewModule, SchematicsRoutingModule],
  declarations: [SchematicsComponent],
  providers: [HighlightService],
})
export class SchematicsModule {}
