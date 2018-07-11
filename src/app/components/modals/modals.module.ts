import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';

// Modals import
import { ConfirmationModalComponent } from './confirmation/confirmation-modal.component';
import { LogoutModalComponent } from './logout/logout-modal.component';

const APP_MODALS = [ConfirmationModalComponent, LogoutModalComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [APP_MODALS],
  entryComponents: [APP_MODALS],
})
export class ModalsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalsModule,
      providers: [],
    };
  }
}
