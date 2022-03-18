import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsComponent } from './assets.component';
import { RouteModule } from './route.module';

const routes: Routes = [
  {
    path: '',
    component: AssetsComponent,
    data: { title: 'Assets' },
  },
  {
    path: 'root',
    loadChildren: () => import('./routes/root/route.module').then((m) => m.RouteModule),
  },
];

export const routing: ModuleWithProviders<RouteModule> = RouterModule.forChild(routes);
