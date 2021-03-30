import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QaComponent } from './qa.component';
import { ChartsComponent } from './routes/charts/charts.component';
import { MapComponent } from './routes/map/map.component';
import { TablesComponent } from './routes/tables/tables.component';
import { GridComponent } from './routes/grid/grid.component';
import { FormsComponent } from './routes/forms/forms.component';
import { CalendarComponent } from './routes/calendar/calendar.component';
import { QaModule } from './qa.module';
import { EntityStoreComponent } from './routes/entity-store/entity-store.component';

const routes: Routes = [
  {
    path: 'maps',
    component: MapComponent,
    data: { title: 'Map' },
  },
  {
    path: 'charts',
    component: ChartsComponent,
    data: { title: 'Charts' },
  },
  {
    path: 'tables',
    component: TablesComponent,
    data: { title: 'Tables' },
  },
  {
    path: 'grid',
    component: GridComponent,
    data: { title: 'Grid' },
  },
  {
    path: 'forms',
    component: FormsComponent,
    data: { title: 'Forms' },
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { title: 'Calendar' },
  },
  {
    path: 'entity-store',
    component: EntityStoreComponent,
    data: { title: 'Entity Store' },
  },
  {
    path: '',
    component: QaComponent,
    data: { title: 'QA Home' },
  },
];

export const routing: ModuleWithProviders<QaModule> = RouterModule.forChild(routes);
