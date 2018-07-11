import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormToolsModule } from '@mello-labs/form-tools';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Vendors
    NgbModule.forRoot(),
    FormToolsModule.forRoot(),
  ],
  exports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, FormToolsModule],
  declarations: [],
})
export class VendorModule {}
