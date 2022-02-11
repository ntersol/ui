import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchematicsComponent } from './schematics.component';

const routes: Routes = [
  {
    path: 'generators',
    component: SchematicsComponent,
    data: {
      title: 'Schematics - Generators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchematicsRoutingModule {}
