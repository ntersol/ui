import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SiteModule } from '../../../../site.module';
import { RootComponent } from './root.component';
import { routing } from './routes';

@NgModule({
  imports: [CommonModule, SiteModule, routing],
  declarations: [RootComponent],
})
export class RouteModule {}
