import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule, MatMenuModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Vendors
    //NgbModule.forRoot(), // ngBootstrap
    // Angular Materials
    MatIconModule, MatMenuModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule, MatExpansionModule
  ],
  exports: [RouterModule, FormsModule, ReactiveFormsModule,// NgbModule,
    MatIconModule, MatMenuModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule, MatExpansionModule
  ],
  declarations: [],
})
export class VendorModule {}
