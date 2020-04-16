import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';

import { CampaignStatusComponent } from './components/status/campaign-status.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { PanelComponent } from './components/panel/panel.component';
import { TimerComponent } from './components/timer/timer.component';
import { NotesComponent } from './components/notes/notes.component';
import { MapPipe } from './pipes/map.pipe';

const COMPONENTS = [
  CampaignComponent,
  PanelComponent,
  CampaignStatusComponent,
  NotesComponent,
  TimerComponent,
  MapPipe,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    ToolbarModule,
  ],
  exports: [CampaignComponent],
  providers: [],
})
export class NtsScripterModule {}
