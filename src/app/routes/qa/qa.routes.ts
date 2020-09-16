
import { Routes, RouterModule } from '@angular/router';

import { QaComponent } from './qa.component';
import { ChartsComponent } from './routes/charts/charts.component';
import { MapComponent } from './routes/map/map.component';
import { TablesComponent } from './routes/tables/tables.component';
import { GridComponent } from './routes/grid/grid.component';
import { FormsComponent } from './routes/forms/forms.component';
import { CalendarComponent } from './routes/calendar/calendar.component';
import { StateManagementComponent } from './routes/state-management/state-management.component';

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
    path: 'state-management',
    component: StateManagementComponent,
    data: { title: 'State Management' },
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { title: 'Calendar' },
  },
  {
    path: '',
    component: QaComponent,
    data: { title: 'QA Home' },
  },
];

export const routing = RouterModule.forChild(routes);
