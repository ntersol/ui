import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
import { TabViewModule } from 'primeng/tabview';
import { NtsVisibleModule } from '@ntersol/visible';

// Routing
import { routing } from './home.routes';

// Components
import { HomeComponent } from './home.component';

// Route State Management
import { RouteUiStateQuery, RouteUiStateService, RouteUiStateStore } from './shared/state/ui';
import { RouteDomainStateService } from './shared/state/domain';
import { HighlightService } from '../../shared/services/highlight.service';
import { SiteModule } from '../../site.module';

@NgModule({
  imports: [
    CommonModule,
    SiteModule,
    routing,
    TabViewModule,
    NtsStateManagementModule,
    NtsFormsModule,
    NtsVisibleModule,
  ],
  declarations: [HomeComponent],
  providers: [HighlightService, RouteUiStateService, RouteUiStateStore, RouteUiStateQuery, RouteDomainStateService],
  exports: [],
  entryComponents: [],
})
export class HomeModule {}
