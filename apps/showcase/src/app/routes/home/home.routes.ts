import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeModule } from './home.module';
import { AngularStarterComponent } from '../apps/routes/angular-starter/angular-starter.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' },
    children: [
      {
        path: 'angular-starter',
        component: AngularStarterComponent,
        data: { title: 'Angular Starter' },
      },

      {
        path: 'tags',
        component: undefined,
        data: { title: 'Tags' },
      },
      {
        path: 'chart',
        component: undefined,
        data: { title: 'Chart' },
      },
      {
        path: 'tree',
        component: undefined,
        data: { title: 'Tree' },
      },
      {
        path: 'grid',
        component: undefined,
        data: { title: 'grid' },
      },
      {
        path: 'forms',
        component: undefined,
        data: { title: 'Forms' },
      },
      {
        path: 'calendar',
        component: undefined,
        data: { title: 'Calendar' },
      },
    ],
  },
];

export const routing: ModuleWithProviders<HomeModule> = RouterModule.forChild(routes);
