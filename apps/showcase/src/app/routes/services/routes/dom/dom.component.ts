import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-dom',
  templateUrl: './dom.component.html',
  styleUrls: ['./dom.component.scss'],
})
export class DomComponent implements OnInit {
  public exampleTSInstall: string = `
  // Install this library
  npm i @ntersol/services --save`;

  public exampleTS: string = `
    // Import into a service or component
    import { DomService } from '@ntersol/services';

    // Inject into constructor
    constructor(private dom: DomService) { }

    ngOnInit() {
      // Use the DOM service to interact with browser APIs instead of directly
      // Note that browser APIs are nullable which requires nill checks
      // This ensures that code that requires a browser is not executed when on node

      // Interact with the window object
      this.dom.window?.setTimeout();

      // Interact with document object
      this.dom.document?.title;

      // Interact with location
      this.dom.location?.href;

      // Interact with local/session storage
      this.dom.localStorage?.getItem('someKey');

      // Perform a browser check
      if(this.dom.isBrowser) {
        // Do something only in the browser
      }

      // Perform a node check
      if(this.dom.isNode) {
        // Do something only in node
      }
    }`;

  constructor(private highlight: HighlightService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
