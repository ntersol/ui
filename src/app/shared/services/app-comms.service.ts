import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
//import { Subscription } from 'rxjs/Subscription';

//import { PostMessageService } from './post-message.service';
//import { UIStoreService } from 'src/app/shared/stores/ui';

//import { AppSettings } from '@shared';

export enum MessageActions {
  RESYNC_UI = 'RESYNC_UI',
  END_MULTISCREEN = 'END_MULTISCREEN',
}

/**
 * Manages communication between multiple app instances or apps that live on separate domains
 * COMMON USAGES:
 *
 */
@Injectable()
export class AppCommsService {
  ///** A list of domains to allow communication from, based on window.location.origin */
  //private allowedDomains: string[] = [window.location.origin];
  ///** Hold subs for unsub */
  //private subs: Subscription[] = [];
  //constructor(private messaging: PostMessageService, private settings: AppSettings, private ui: UIStoreService) {
  //  this.commsEnable();
  //}
  ///**
  // * Start listening for app communication
  // */
  //public commsEnable() {
  //  this.subs = [
  //    // Watch UI Store changes and fire the resync UI method to update store state in all instances
  //    Observable.combineLatest([this.ui.multiDocs$, this.ui.multiScreen$, this.ui.docViewerGuids$]).subscribe(res =>
  //      this.resyncUI(),
  //    ),
  //    // Listen for any interapp communication on same domain
  //    this.messaging.listenForMessages(this.allowedDomains).subscribe(message => {
  //      // console.log('Message Received', message);
  //      switch (message.event) {
  //        case MessageActions.RESYNC_UI:
  //          // If a UI store state payload was passed, load that into the store
  //          if (message.payload) {
  //            this.ui.rehydrateUI(message.payload);
  //          } else {
  //            // Otherwise update UI state from localstorage
  //            this.ui.rehydrateUI(JSON.parse(window.localStorage.getItem('ui')));
  //          }
  //          break;
  //        case MessageActions.END_MULTISCREEN:
  //          this.ui.multiScreenToggle(false);
  //          break;
  //      }
  //    }),
  //  ];
  //  // Manage the state of multiscreen functionality
  //  this.multiScreenState();
  //  // When this window is closed, tell parent to end multiscreen
  //  window.onbeforeunload = () => {
  //    if (window.opener) {
  //      this.messaging.postMessageToWindow(window.opener, { event: MessageActions.END_MULTISCREEN, payload: null });
  //    }
  //  };
  //}
  ///**
  // * Disable app communication
  // */
  //public commsDisable() {
  //  if (this.subs.length) {
  //    this.subs.forEach(sub => sub.unsubscribe());
  //  }
  //}
  ///**
  // * Resync the UI state between multiple instances of the web app
  // */
  //private resyncUI() {
  //  if (this.ui.screen) {
  //    this.messaging.postMessageToWindow(this.ui.screen, { event: MessageActions.RESYNC_UI, payload: null });
  //  } else if (window.opener) {
  //    this.messaging.postMessageToWindow(window.opener, { event: MessageActions.RESYNC_UI, payload: null });
  //  }
  //}
  ///**
  // * Manage the state of multiscreen functionality
  // */
  //private multiScreenState() {
  //  let slug = window.location.origin + window.location.pathname;
  //  this.subs.push(
  //    this.ui.multiScreen$.subscribe(multiScreen => {
  //      // If multiscreen is present and a window is not yet open and has not been closed
  //      if (multiScreen && !this.ui.screen && !window.opener) {
  //        setTimeout(() => {
  //          this.ui.screen = window.open(slug + '#/viewer/' + this.settings.lnkey, 'Document Viewer');
  //        });
  //      } else if (this.ui.screen && this.ui.screen.closed) {
  //        // If window has been closed
  //        this.ui.screen = null;
  //      } else if (multiScreen && this.ui.screen) {
  //        // If multi screen has been set and a window is already opened, update url in current window
  //        setTimeout(() => {
  //          (this.ui.screen.location.href = slug + '#/viewer/' + this.settings.lnkey), 'Document Viewer';
  //        });
  //      } else if (this.ui.screen && multiScreen === false) {
  //        // If screen is open and multiscreen is false, close window
  //        this.ui.screen.close();
  //        this.ui.screen = null;
  //      }
  //    }),
  //  );
  //}
}
