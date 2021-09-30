import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScriptLoaderComponent } from './routes/script-loader/script-loader.component'
import { UtilitiesComponent } from './utilities.component';
import { UtilitiesModule } from './utilities.module';

const routes: Routes = [
  {
    path: 'script-loader',
    component: ScriptLoaderComponent,
    data: { title: 'Script Loader' },
  },
  {
    path: '',
    component: UtilitiesComponent,
    data: { title: 'Utilities' },
  },
];

export const routing: ModuleWithProviders<UtilitiesModule> = RouterModule.forChild(routes);
