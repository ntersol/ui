import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
})
export class StorageComponent implements OnInit {
  public exampleTSInstall: string = `
  // Install this library
  npm i @ntersol/services --save`;

  public exampleTS: string = `
    // Import into a service or component
    import { StorageService } from '@ntersol/services';

    // Keys for local storage and session storage
    type LocalStorageKeys = 'token' | 'user';
    type SessionStorageKeys = 'someKey';

    @Injectable({
      providedIn: 'root',
    })
    export class AppStorageService extends StorageService&lt;LocalStorageKeys, SessionStorageKeys&gt; {
      // Token
      public token$ = this.localStorage.getItem$('token');
      public set token(token: string | null) {
        this.localStorage.setItem('token', token);
      }
      public get token() {
        return this.localStorage.getItem('token');
      }

      // User
      public user$ = this.localStorage.getItem$<Models.User>('user', { isJson: true });
      public get user() {
        return this.localStorage.getItem('user', { isJson: true });
      }
      public set user(user: Models.User | null) {
        this.localStorage.setItem('user', user);
      }

      constructor() {
        super();
      }
    }`;

  constructor(private highlight: HighlightService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
