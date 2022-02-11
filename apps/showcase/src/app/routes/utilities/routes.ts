import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogPage } from './routes/dialog/dialog.page';
import { FocusTrapComponent } from './routes/focus-trap/focus-trap.component';
import { Formgroup2ApiComponent } from './routes/formgroup2-api/formgroup2-api.component';
import { ImageResizerComponent } from './routes/image-resizer/image-resizer.component';
import { LibLoaderComponent } from './routes/lib-loader/lib-loader.component';
import { RemoveNilsComponent } from './routes/remove-nils/remove-nils.component';
import { ScriptLoaderComponent } from './routes/script-loader/script-loader.component';
import { UtilitiesComponent } from './utilities.component';
import { UtilitiesModule } from './utilities.module';

const routes: Routes = [
  {
    path: 'remove-nils',
    component: RemoveNilsComponent,
    data: { title: 'Remove Nils' },
  },
  {
    path: 'script-loader',
    component: ScriptLoaderComponent,
    data: { title: 'Script Loader' },
  },
  {
    path: 'lib-loader',
    component: LibLoaderComponent,
    data: { title: 'Lib Loader' },
  },
  {
    path: 'formgroup-2-api',
    component: Formgroup2ApiComponent,
    data: { title: 'FormGroup 2 Api' },
  },
  {
    path: 'image-resizer',
    component: ImageResizerComponent,
    data: { title: 'Image Resizer' },
  },
  {
    path: 'focus-trap',
    component: FocusTrapComponent,
    data: { title: 'Focus Trap' },
  },
  {
    path: 'dialog',
    component: DialogPage,
    data: { title: 'Dialog' },
  },
  {
    path: '',
    component: UtilitiesComponent,
    data: { title: 'Utilities' },
  },
];

export const routing: ModuleWithProviders<UtilitiesModule> = RouterModule.forChild(routes);
