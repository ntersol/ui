import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-signal-r',
  templateUrl: './signal-r.component.html',
  styleUrls: ['./signal-r.component.scss']
})
export class SignalRComponent implements OnInit {

  public exampleTSInstall: string =
    `
  // Install this library
  npm i @ntersol/services --save

  // Install signalR
  npm install @aspnet/signalr –-save  `;

  public exampleTS: string =
    `
    // Import into a service or component
    import { NtsSignalRService } from '@ntersol/services';

    // Inject into constructor
    constructor(private signalR: NtsSignalRService) { }

    // Start the connection to signalR
    // Provide path to signalR endpoint and a token if required
    this.signalR.connectionStart('/api/signalr', 'OPTIONAL_TOKEN');

    // Add a listener to an event
    this.signalR.listenStart<boolean>('UPDATE_COMPLETE').subscribe(response => {
      // Response received from signalR
      console.log(response);
    });

    // Stop listening to an event
    this.signalR.listenEnd('UPDATE_COMPLETE');

    // Send data via signalR to the backend
    this.signalR.broadcastData('UPDATE_STARTED', {})?.then(() => {
      // Act on a successful response
    });

    // If the token changes, update signalR
    this.signalR.tokenUpdate('NEW_TOKEN');

    // End signalR connection
    this.signalR.connectionEnd();    `;

  constructor(private highlight: HighlightService) { }

  ngOnInit(): void {
    /**
    // Start the connection to signalR
    this.signalR.connectionStart('/api/signalr', 'OPTIONAL_TOKEN');

    // Add a listener to an event
    this.signalR.listenStart<boolean>('UPDATE_COMPLETE').subscribe(response => {
      // Response received from signalR
      console.log(response)
    });

    // Stop listening to an event
    this.signalR.listenEnd('UPDATE_COMPLETE');

    // Send data via signalR to the backend
    this.signalR.broadcastData('UPDATE_STARTED', {})?.then(() => {
      // Act on a successful response
    });

    // If the token changes, update signalR
    this.signalR.tokenUpdate('NEW_TOKEN');

    // End signalR connection
    this.signalR.connectionEnd();
     */
  }





  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
