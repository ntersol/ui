import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { SiteModule } from '../../../site.module';
import { PwaRoutingModule } from './pwa-routing.module';
import { PwaComponent } from './pwa.component';

@NgModule({
  declarations: [PwaComponent],
  imports: [CommonModule, PwaRoutingModule, SiteModule, TabViewModule, TimelineModule],
})
export class PwaModule {}
