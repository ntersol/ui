import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SiteModule } from '../../site.module';
import { AssetsComponent } from './assets.component';
import { routing } from './routes';

@NgModule({
  imports: [CommonModule, SiteModule, routing],
  declarations: [AssetsComponent],
})
export class RouteModule {}
