import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PwaComponent } from './pwa.component';

const routes: Routes = [{ path: '', component: PwaComponent, data: { title: 'PWA Generation' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PwaRoutingModule {}
