import { Component, OnInit } from '@angular/core';
import { NtsServiceWorkerService } from '@ntersol/services';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-service-worker',
  templateUrl: './service-worker.component.html',
  styleUrls: ['./service-worker.component.scss'],
})
export class ServiceWorkerComponent implements OnInit {
  public exampleTSInstall: string = `
  // Install this library
  npm i @ntersol/services --save`;

  public exampleTS: string = `
    // Import into a service or component
    import { NtsServiceWorkerService } from '@ntersol/services';

    // Inject into constructor
    constructor(private sw: NtsServiceWorkerService) { }

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
    this.signalR.connectionEnd();`;

  constructor(private highlight: HighlightService, private sw: NtsServiceWorkerService) {}

  ngOnInit(): void {
    // Start polling for updates to the service worker. Default is 5 minutes. When an update is found updateAvailable$ will be fired
    this.sw.pollforUpdates();

    // Subscribe to updates. This will fire when an update to the service worker is detected
    this.sw.updateAvailable$.subscribe(() => {
      // Do something on update such as pop a modal asking if the user wants to refresh
    });

    // Request permission from the user to accept push notifications
    // By default permission will be requested when the sub is created, this can be used to handle rejected states
    this.sw.requestPermission();

    // Create a push subscription
    // First arg is the path to the backend that receives the subscriptions, the second is the VAPID key
    this.sw.pushSubscriptionCreate('/api/pushsubscriptions', '12345678');

    // Listen for push notifications received from the backend
    this.sw.pushSubscription$.subscribe((pushSubscription) => {
      // Do somehting with a push response
      console.log(pushSubscription);
    });

    // Remove a push notification subscription
    this.sw.pushSubscriptionRemove();

    // Unregister and remove a service worker
    this.sw.remove();
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
