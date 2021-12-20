import { Injectable } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { interval, Observable, BehaviorSubject, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, take, switchMap, filter } from 'rxjs/operators';

/** Model that needs to be sent from the server to the service worker */
export interface NotificationServerResponse {
  notification: NotificationServer;
}

export interface NotificationOptions {
  dir?: NotificationDirection;
  lang?: string;
  body?: string;
  tag?: string;
  image?: string;
  icon?: string;
  badge?: string;
  sound?: string;
  vibrate?: number | number[];
  timestamp?: number;
  renotify?: boolean;
  silent?: boolean;
  requireInteraction?: boolean;
  data?: any;
}

interface NotificationServer extends NotificationOptions {
  title: string; // Title is only required field
  actions?: NotificationAction[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export type NotificationPermission = 'default' | 'denied' | 'granted';
export type NotificationDirection = 'auto' | 'ltr' | 'rtl';

export interface PushResponse {
  notification: Notification;
  event: Event;
  type: 'show' | 'click';
}

/**
 * Manage service worker functionality including push notifications
 * TROUBLESHOOTING:
 * Check chrome://gcm-internals/ and look under the 'Receive Message Log' to see if your browser is getting the push response
 * Make sure the payload being sent from the server to the browser is the correct format: https://stackoverflow.com/a/53763526
 */
@Injectable({ providedIn: 'root' })
export class NtsServiceWorkerService {
  /** Is an update available */
  public updateAvailable$ = new BehaviorSubject<boolean>(false);
  /** Is the service worker enabled */
  public isEnabled = this.sw.isEnabled;
  /** Handle click events on notifications */
  public notificationClicks$ = this.swPush.notificationClicks;
  /** Does this app have permission to send push notifications? */
  private permission: NotificationPermission = ('Notification' in window) ? Notification.permission : 'denied';
  /** Service worker instance */
  public worker$: Observable<ServiceWorkerRegistration | undefined | null> = new BehaviorSubject(null);
  /** Get the current active push notification. Null if it does not exist */
  public pushSubscription$: Observable<PushSubscription | null> = new BehaviorSubject(null);
  public isPushActive$ = this.pushSubscription$.pipe(map(x => !!x));

  constructor(private sw: SwUpdate, private swPush: SwPush, private http: HttpClient) {
    // Add legacy support to browsers without a service worker
    if (navigator && navigator.serviceWorker) {
      this.worker$ = from(navigator.serviceWorker.getRegistration());
      this.pushSubscription$ = this.worker$.pipe(switchMap(registration => (registration ? from(registration.pushManager.getSubscription()) : of(null))));
    }
  }

  /**
   * Ask the user for permission to send push notifications
   */
  public requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission(status => (this.permission = status));
    }
  }

  /**
   * Send a notification from the browser window
   * @param title
   * @param options
   */
  public sendNotification(title: string, options?: NotificationOptions): Observable<PushResponse> {
    return new Observable<PushResponse>(obs => {
      // Check if notification api is available
      if (!('Notification' in window)) {
        obs.error('Notifications are not available in this environment');
        obs.complete();
      }

      // Check if permission was granted
      if (this.permission !== 'granted') {
        this.requestPermission(); // Ask for permission
        obs.error(`The user hasn't granted you permission to send push notifications`);
        obs.complete();
      }

      // Create new notification
      const n = new Notification(title, options);
      // Handle responses to notification popup
      n.onshow = e => obs.next({ notification: n, event: e, type: <'show'>e.type });
      n.onclick = e => obs.next({ notification: n, event: e, type: <'click'>e.type });
      n.onerror = e => obs.error({ notification: n, event: e, type: e.type });
      n.onclose = () => obs.complete();
    });
  }

  /**
   * Start polling for SW/app changes based on the supplied interval
   * @param intervalTime Default 5 minutes, 5 * 60 * 1000
   */
  public pollforUpdates(intervalTime = 5 * 60 * 1000) {
    if (!this.sw.isEnabled) {
      console.error('Service Worker not enabled');
      return;
    }
    // If an update is available, notify the app. Called before checkForUpdate so it will fire if update available on load
    this.sw.available.subscribe(() => this.updateAvailable$.next(true));
    // Immediately check for an update when service loads
    // Otherwise SW will always serve old version of app
    this.sw.checkForUpdate();
    // Poll for updates
    interval(intervalTime).subscribe(() => this.sw.checkForUpdate());
  }

  /**
   * Get a push subscription, pass to the backend for use with web push
   * @param pathToApi URL to location to pass the subscription to
   * @param publicKey A VAPID public key
   * @param forceSend Always send the sub to the backend even if it already exists
   */
  public pushSubscriptionCreate(pathToApi: string, publicKey: string, forceSend = false) {
    if (!this.sw.isEnabled) {
      console.error('Service Worker not enabled');
      return;
    }

    // Get current push subscription, null if not exists
    this.pushSubscription$
      .pipe(
        take(1), // Only get once
        filter(subCurrent => !subCurrent || forceSend), // If no existing sub or force send is set
        switchMap(() => this.worker$), // Get service worker
        filter(w => !!w), // Null check for service worker
        map(s => (s ? s.pushManager : undefined)), // Map to push manager
      )
      .subscribe(pm => {
        if (pm) {
          pm.subscribe({ applicationServerKey: publicKey, userVisibleOnly: true })
            .then(sub => this.http.post(pathToApi, sub).subscribe())
            .catch(err => console.error('Error getting push subscription: ', err));
        } else {
          console.error('Push manager not defined');
        }
      });
    return this.pushSubscription$;
  }

  /**
   * Unsubscribe the current push subscription if present
   * @param pathToApi If supplied will send a delete request to the supplied path
   */
  public pushSubscriptionRemove(pathToApi?: string) {
    if (!this.sw.isEnabled) {
      console.error('Service Worker not enabled');
      return;
    }
    this.pushSubscription$.pipe(take(1)).subscribe(s => {
      if (s) {
        s.unsubscribe().then(() => {
          if (pathToApi) {
            this.http.delete(pathToApi).subscribe();
          }
        });
      }
    });
  }

  /**
   * Unregister and remove all service workers
   * @param callback Function to execute after sw has been unregistered
   */
  public remove() {
    navigator.serviceWorker.getRegistrations().then(registrations => registrations.forEach(reg => reg.unregister()));
  }
}
