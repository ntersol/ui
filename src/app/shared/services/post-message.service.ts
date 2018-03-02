import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ObjectUtils } from '@utils';

interface Message {
  event?: string;
  payload?: any;
  token?: string;
}

@Injectable()
export class PostMessageService {

  /** Postmessage response */
  public postMessage$: Subject<Message> = new Subject();
  /** Holds postmessage event listener */
  private postMessageListener;
  /** An array of domains to accept postmessage responses from, based on window.location.origin */
  private allowedDomains: string[];

  constructor() {
  }

  /**
   * Activates the post message listener
   * @param allowedDomains - Allowable domains to whitelist message responses. Based on window.location.origin
   * @param allowOwnDomain - Allow this app to receive broadcasts from itself. Used for multi app instances that need to share data
   */
  public listenForMessages(allowedDomains?: string[]) {
    // Set allowed domains to receive messages from
    if (allowedDomains) {
      this.allowedDomains = allowedDomains;
    }
    // If not IE
    if (window.addEventListener) {
      this.postMessageListener = window.addEventListener('message', this.messageReceived.bind(this), false);
    } else {
      // If IE
      this.postMessageListener = (<any>window).attachEvent('onmessage', this.messageReceived.bind(this), false);
    }
    return this.postMessage$;
  }


  /**
   * Send a message to another tab in the current browser. That tab must be listening in order to receive.
   * @param target - Set the postmessage target
   * @param message - The message payload
   * @param urlTarget - The destination URL. Will only post to this url. Default is broadcast to all which only impacts target:url
   * @param id - If target is set to iframe, supply the CSS ID without the #. IE iframeMe if <iframe #id="iframeMe">
   */
  public postMessage(target: 'iframe' | 'parent' | 'url', message: Message, urlTarget: string = '*', id?: string) {
    let msg = ObjectUtils.sanitize(message);
    switch (target) {
      // Target specific url
      case ('url'):
        window.postMessage(msg, urlTarget);
        break;
      // Embedded iframe
      case ('iframe'):
        (<any>document).getElementById(id).contentWindow.postMessage(msg, urlTarget);
        break;
      // Parent of current app if in an iframe
      case ('parent'):
        window.parent.postMessage(msg, urlTarget);
        break;
    }
  }

  /**
   * When a message was received via the postMessage event listener
   * @param event - The event passed from the event listener
   */
  private messageReceived(event: MessageEvent) {
    if (event.data && event.data.type != 'webpackOk' && event.origin != window.location.origin) {
      let msg = ObjectUtils.sanitize(event.data);
      if (this.allowedDomains && this.allowedDomains.includes(event.origin) || !this.allowedDomains) {
        this.postMessage$.next(msg);
      } else {
        console.error('Message from unauthorized source');
      }
    }
  }
  
}
