export const install = `
  npm i @ntersol/state-management --save`;

export const importExample = `
  import { NtsStateManagementModule } from '@ntersol/state-management';`;

export const usage1 = `
  import { ntsUIStoreCreator } from &#39;@ntersol/state-management&#39;;

  // set up interface for the store
  interface UIStoreModel {
    name: string | null;
    user?: {
      nameFirst: string | null;
      age: number;
    };
  }

  @Injectable({
    providedIn: &#39;root&#39;,
  })
  export class SampleService {
    // Create a ui store creator instance with default state using interface model and options
    public uiStore = ntsUIStoreCreator&lt;UIStoreModel&gt;({ name: null, user: { age: 12, nameFirst: &#39;NameFirst123&#39; } }, { persistId: &#39;uiStore&#39; });

    constructor() {}
  }`;

export const usage2 = `
  export class SampleComponent implements OnInit {
    // Get the name slice of state as an observable
    public name$ = this.sm.uiStore.select$(&#39;name&#39;);
    // Get a specific piece of state by passing a callback function as an observable
    public name2$ = this.sm.uiStore.select$(state => state.user?.age);

    ngOnInit() {
      //subscribe the the ui state for name and log any changes
      this.name$.subscribe(x => console.log(x));
      //subscribe the the ui state for specific state slice and log any changes
      this.name2$.subscribe(x => console.log(x));
    }

    // Update the state on the UI store with the new object
    public nameSave(name: string | null) {
      this.sm.uiStore.update({ name: name });
    }
  }`;

export const usage3 = `
  Your Name: &lt;strong&gt;{{ name$ | async }}&lt;/strong&gt;
  &lt;input placeholder=&quot;Your Name&quot; [(ngModel)]=&quot;name&quot; /&gt; &lt;button (click)=&quot;nameSave(name)&quot;&gt;Save Name&lt;/button&gt;`;
