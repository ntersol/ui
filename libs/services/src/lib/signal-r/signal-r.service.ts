import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Subject, BehaviorSubject } from 'rxjs';

// Closure containing token
type tokenFn = () => string;

/**
 * Manage SignalR connectivity
 * USAGE:  this.signalR.connectionStart('/api/signalr', () => this.settings.token);
 * USAGE:  this.signalR.listenStart<string>('ReceiveCallEvent').subscribe(data => console.log(data));
 * https://code-maze.com/netcore-signalr-angular/
 */
@Injectable({
  providedIn: 'root',
})
export class NtsSignalRService {
  public isActive$ = new BehaviorSubject(false);
  /** Is SignalR currently running */
  public isActive = false;
  /** Hold ref to signalR hub */
  private hubConnection: signalR.HubConnection | null = null;
  /** A dictionary of observables tied to a specific ID that will listen to an ID */
  private connections: { [key: string]: Subject<any> } = {};
  /**
   * An array of message events where the observable has been created BEFORE signalR is ready.
   * After signalR is ready these IDs will have their signalR ON event attached to the observable
   */
  private queuedIDs: string[] = [];

  private _token!: string | tokenFn | null;
  /** Return the token if it is a string or a closure that returns a string */
  private get token(): string | null {
    return typeof this._token === 'function' ? this._token() : this._token;
  }

  constructor() {
    if (!signalR) {
      console.error(`SignalR not installed. Install with: npm install '@aspnet/signalr –-save'`);
    }
  }

  /**
   * Start a connection to signalR
   * @param signalRUrl - Location of the api url for signalr
   * @param token - The bearer token to pass for requests. This argument accepts either a string or a closure that returns a string.
   * If using a string, be sure to use the tokenUpdate method in this file when the token changes.
   * The closure should return the token, IE () => this.settings.token
   * @param retryTime - If signalR is unavailable, retry in this many milliseconds
   * @param isReconnecting - Indicates signalR connection closed and needs to reconnect
   */
  public connectionStart(signalRUrl: string, token: string | tokenFn, retryTime = 10000, isReconnecting: boolean = false) {
    // Set/update token
    this._token = token;

    // Require a signalR url and a token
    if (!signalRUrl || !this.token || typeof this.token !== 'string') {
      return;
    }

    // If connection already exists, return that. No need to reinitialize
      if (this.hubConnection && !isReconnecting) {
        return this.hubConnection;
      }

      if(!this.hubConnection) {
        this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(signalRUrl, <signalR.IHttpConnectionOptions>{ accessTokenFactory: () => this.token })
          .build();

        // increase default timeout from 30s
        this.hubConnection.serverTimeoutInMilliseconds = 60000;

        // restart connection if timeout
        this.hubConnection.onclose((err: any) => {
          if (
            String(err)
              .toLowerCase()
              .includes('timeout')
          ) {
            console.error("SignalR Connection Timeout:", err);
            console.log('Restarting SignalR Connection');
            setTimeout(() => this.connectionStart(signalRUrl, <string | tokenFn>this.token, 5000, true), 5000);
          }
        });
      }

    // Start signalR
    const hubConnection = this.hubConnection.start();

    // Watch status
    hubConnection
      // If any queued ID's, attach ON event to the observable
      .then(() => {
        this.isActive = true;
        this.isActive$.next(true);
        // If any ID's are queued, start the listener for them
        if (this.queuedIDs.length) {
          this.queuedIDs.forEach(key => this.listenStart(key));
          this.queuedIDs = []; // Reset queue
        }
      })
      // If error on start, retry
      .catch((err: any) => {
        // If error is "unauthorized", end connection and do not retry. Otherwise keep trying
        if (
          String(err)
            .toLowerCase()
            .includes('unauthorized')
        ) {
          this.connectionEnd();
        } else {
          setTimeout(() => this.connectionStart(signalRUrl, <string | tokenFn>this.token, retryTime), retryTime);
        }
      });
    // Return promise of signalR startup status
    return this.hubConnection;
  }

  /**
   * End the active signalR connection
   */
  public connectionEnd() {
    // Make sure a connection exists
    if (!this.hubConnection) {
      return;
    }

    // Null out token reference
    this._token = null;

    // Complete and end all open subscriptions
    Object.keys(this.connections).forEach(key => {
      this.connections[key].complete();
      delete this.connections[key];
    });

    // Stop connection
    const hubConnection = this.hubConnection.stop();
    // End connection
    hubConnection
      .then(() => {
        this.isActive = false;
        this.isActive$.next(false);
        // Null out existing connection after stopping
        this.hubConnection = null;
      })
      .catch((err: any) => {
        console.log('Error while stopping connection: ' + err);
        // On error, attempt to end connection every 10 seconds
        setTimeout(() => this.connectionEnd(), 10000);
      });

    // Return promise of stop status
    return hubConnection;
  }

  /**
   * Listen to data being returned from signalR
   * Returns an observable that will only update on the event specified by 'id'
   * @param id The unique ID of the message event
   */
  public listenStart<t>(id: string) {
    // If observable for this message ID does not exist
    if (!this.connections[id]) {
      // Create observable in connections dictionary
      this.connections[id] = new Subject<t>();
    }
    // Make sure hub connection has been started
    if (this.hubConnection) {
      // Add event listener to hub connection
      this.hubConnection.on(id, (data: any) => this.connections[id].next(JSON.parse(data)));
    } else {
      // Hub connection has not been created yet, add ID to queue. listenStart will be rerun after hub connects
      this.queuedIDs = [...this.queuedIDs, id];
    }
    // Return subject
    return <Subject<t>>this.connections[id];
  }

  /**
   * End signalR connection
   * Remove data listener, complete the observable and delete from array
   * @param id
   */
  public listenEnd(id: string) {
    if (!this.hubConnection) {
      return;
    }
    this.hubConnection.off(id, () => {
      this.connections[id].complete();
      delete this.connections[id];
    });
  }

  /**
   * Broadcast data to signalR
   * @param id The unique ID of the message event
   * @param data Any data to push
   */
  public broadcastData(id: string, data: any) {
    if (!this.hubConnection) {
      return;
    }
    // Invoke data
    const connection = this.hubConnection.invoke(id, data);
    // Handle responses
    connection.catch((err: any) => console.error(err));
    // Return status promise
    return connection;
  }

  /**
   * Update the token signalR will use to communicate with the webapi
   * @param token
   */
  public tokenUpdate(token: string) {
    this._token = token;
  }
}
