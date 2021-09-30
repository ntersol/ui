import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Formgroup2ApiComponent } from './routes/formgroup2-api/formgroup2-api.component';
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
    path: 'formgroup-2-api',
    component: Formgroup2ApiComponent,
    data: { title: 'FormGroup 2 Api' },
  },
  {
    path: '',
    component: UtilitiesComponent,
    data: { title: 'Utilities' },
  },
];

export const routing: ModuleWithProviders<UtilitiesModule> = RouterModule.forChild(routes);
