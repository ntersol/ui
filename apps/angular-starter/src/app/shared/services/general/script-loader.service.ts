import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';

export interface ScriptModel {
  name: string;
  src: string;
  loaded?: boolean;
}

interface Scripts {
  [id: string]: ScriptModel;
}

export enum ScriptName {
  // Example
  // ApplyNow = 'applyNow'
}

export const ScriptStore: Scripts = {
  // Example
  // [ScriptName.ApplyNow]: {
  //   name: ScriptName.ApplyNow,
  //   src: 'https://widget.ellieservices.com/latest/launcher.js',
  // },
};

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private scripts: ScriptModel[] = [];

  public load(script: ScriptModel): Observable<ScriptModel> {
    return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
      const existingScript = this.scripts.find(s => s.name == script.name);

      // Complete if already loaded
      if (existingScript && existingScript.loaded) {
        observer.next(existingScript);
        observer.complete();
      } else {
        // Add the script
        this.scripts = [...this.scripts, script];

        // Load the script
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = script.src;

        scriptElement.onload = () => {
          script.loaded = true;
          observer.next(script);
          observer.complete();
        };

        scriptElement.onerror = (error: unknown) => {
          observer.error('Couldn\'t load script ' + script.src + ', error: ' + error);
        };

        document.getElementsByTagName('body')[0].appendChild(scriptElement);
      }
    });
  }
}
