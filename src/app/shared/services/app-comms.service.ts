import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { PostMessageService } from './post-message.service';
import { UIStoreService } from 'src/app/shared/stores/ui';

import { environment } from '$env';

export enum MessageActions {
  RESYNC_UI = 'RESYNC_UI',
  END_MULTISCREEN = 'END_MULTISCREEN',
}

/**
 * Manages communication between multiple app instances or apps that live on separate domains
 */
@Injectable()
export class AppCommsService {
  /** Hold subs for unsub */
  private subs: Subscription[] = [];

  constructor(private messaging: PostMessageService, private ui: UIStoreService) {}

  /**
   * Start listening for app communication
   */
  public commsEnable() {
    this.subs = [
      // Watch UI Store changes and fire the resync UI method to update store state in all instances
      this.ui.select.saveState$.subscribe(() => this.resyncUI()),
      // Listen for any interapp communication set by the listenTo env settings
      this.messaging.listenForMessages(environment.domains.listenTo).subscribe(message => {
        switch (message.event) {
          // Resync any UI Changes
          case MessageActions.RESYNC_UI:
            // If a UI store state payload was passed, load that into the store
            if (message.payload) {
              this.ui.storeStateRestore(message.payload);
            } else {
              // Otherwise update UI state from localstorage
              this.ui.storeStateRestore(JSON.parse(window.localStorage.getItem('ui')));
            }
            break;
          // Notify parent window that this window has closed
          case MessageActions.END_MULTISCREEN:
            this.ui.multiScreenToggle(false);
            break;
        }
      }),
    ];

    // Manage the state of multiscreen functionality
    this.multiScreenState();

    // When this window is closed, tell parent to end multiscreen
    window.onbeforeunload = () => {
      if (window.opener) {
        this.messaging.postMessageToWindow(window.opener, { event: MessageActions.END_MULTISCREEN, payload: null });
      }
    };
  }

  /**
   * Disable app communication
   */
  public commsDisable() {
    if (this.subs.length) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

  /**
   * Resync the UI state between multiple instances of the web app
   */
  private resyncUI() {
    if (this.ui.screen) {
      this.messaging.postMessageToWindow(this.ui.screen, { event: MessageActions.RESYNC_UI, payload: null });
    } else if (window.opener) {
      this.messaging.postMessageToWindow(window.opener, { event: MessageActions.RESYNC_UI, payload: null });
    }
  }

  /**
   * Manage the state of multiscreen functionality
   */
  private multiScreenState() {
    // Get current path
    const slug = window.location.origin + window.location.pathname;
    this.subs.push(
      this.ui.select.multiScreen$.subscribe(multiScreen => {
        // If multiscreen is present and a window is not yet open and has not been closed
        if (multiScreen && !this.ui.screen && !window.opener) {
          setTimeout(() => {
            this.ui.screen = window.open(slug + '#/', 'App Instance');
          });
        } else if (this.ui.screen && this.ui.screen.closed) {
          // If window has been closed
          this.ui.screen = null;
        } else if (multiScreen && this.ui.screen) {
          // If multi screen has been set and a window is already opened, update url in current window
          this.ui.screen = window.open(slug + '#/', 'App Instance');
        } else if (this.ui.screen && multiScreen === false) {
          // If screen is open and multiscreen is false, close window
          this.ui.screen.close();
          this.ui.screen = null;
        }
      }),
    );
  }
}
