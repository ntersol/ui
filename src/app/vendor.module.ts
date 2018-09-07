import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from '$libs';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    ChartsModule,

    // Vendors
    NgbModule.forRoot(),
  ],
  exports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, ChartsModule],
  declarations: [],
})
export class VendorModule {}
