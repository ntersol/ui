import { Component, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

// https://blog.angularindepth.com/easier-embedding-of-angular-ui-in-ag-grid-52db93b73884
@Component({
  selector: 'app-template-renderer',
  template: `
    <ng-container
      *ngTemplateOutlet="template; context: templateContext"
    ></ng-container>
  `
})
export class TemplateRendererComponent implements ICellRendererAngularComp {
  template: TemplateRef<any>;
  templateContext: { $implicit: any, params: any };

  refresh(params: any): boolean {
    if (params.data) {
      this.templateContext = {
        $implicit: params.data,
        params: params
      };
      return true;
    }
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.template = (<any>params)['ngTemplate'];
    //this.template = () => 'test'
    this.refresh(params);
  }
}
