import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { NtsDomainStateComponent } from './components/api-state/api-state.component';
import { NtsErrorComponent } from './components/error/error.component';
import { EntityToArray } from './pipes/entity-to-array.pipe';
import { EntityData } from './pipes/entity-data.pipe';
import { EntityIsLoaded } from './pipes/is-loaded.pipe';

const Components = [NtsDomainStateComponent, NtsErrorComponent, EntityToArray, EntityData, EntityIsLoaded];

/**
 * State management tools intended to work with Akita
 */
@NgModule({
  declarations: [Components],
  imports: [CommonModule, AccordionModule, ProgressBarModule, MessageModule],
  exports: [Components],
})
export class NtsStateManagementModule {}
