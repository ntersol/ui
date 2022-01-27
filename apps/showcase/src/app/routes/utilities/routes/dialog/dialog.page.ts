import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-dialog',
  templateUrl: './dialog.page.html',
  styleUrls: ['./dialog.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogPage implements AfterViewInit {
  public enabled = false;
  public opened = false;
  public rootRouterTS: string = `
    // Add path, outlet, and component configuration to root router
    {
      path: 'open',
      outlet: 'dialog',
      component: DialogComponent
    },
  `;
  public namedOutletHTML: string = `
    <router-outlet></router-outlet>
    <!-- Add named outlet to app root HTML -->
    <router-outlet name="dialog"></router-outlet>
    <p-confirmDialog [style]="{ width: '50vw' }"></p-confirmDialog>
  `;
  public usageHTML: string = `
    <!-- Link to your dialog like so -->
    <a class="p-link" [routerLink]="['', { outlets: { dialog: 'open' } }]">Open Dialog Route</a>
  `;

  constructor(public highlight: HighlightService) {}

  ngAfterViewInit(): void {
    this.highlight.highlightAll();
  }
}
