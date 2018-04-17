import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//// 3rd Party Tools
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap
//import { DatagridModule } from '@mello-labs/datagrid';
//import { FormToolsModule } from '@mello-labs/form-tools';
//import { ApiToolsModule } from '@mello-labs/api-tools';
//import { ComponentsModule } from '$components';

//import { SharedModule } from '$shared';

// import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';


console.assert(SharedModule, "Uhoh, Something was not defined, likely part of a circular reference loop, home.module");

@NgModule({
  imports: [
    CommonModule,

    //SharedModule,
    
    // Mello Labs
    // DatagridModule.forRoot(),
    
    // ComponentsModule,

  ],
  declarations: [],
  exports: []
})
export class HomeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HomeModule,
      providers: [],
    };
  }
}
