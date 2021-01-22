import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-demo-modal',
  templateUrl: './demo-modal.component.html',
  styleUrls: ['./demo-modal.component.css'],
})
export class DemoModalComponent implements OnInit {
  constructor(public dialogService: DialogService) {}

  ngOnInit() {
    console.log(this.dialogService); // Modal controls
    // console.log(this.config); // Modal data passed from service
  }
}
