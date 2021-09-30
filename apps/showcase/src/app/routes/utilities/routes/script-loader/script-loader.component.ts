import { Component, OnInit } from '@angular/core';
import { scriptLoad$ } from '@ntersol/utils';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'nts-script-loader',
  templateUrl: './script-loader.component.html',
  styleUrls: ['./script-loader.component.css']
})
export class ScriptLoaderComponent implements OnInit {

  public exampleTS: string =
    `
    import { scriptLoad$ } from '@ntersol/utils';

    // Standard request
    scriptLoad$('https://unpkg.com/dayjs@1.8.21/dayjs.min.js').subscribe(() => {
      // Script loaded successfully
    })

    // Now with pipeable operator goodness and error handling
    scriptLoad$('https://unpkg.com/dayjs@1.8.21/dayjs.NOPE.js').pipe(debounceTime(100)).subscribe(
      () => console.log('Script loaded successfully'),
      error => console.error(error)
    )`;

  constructor() { }

  ngOnInit(): void {
    scriptLoad$('https://unpkg.com/dayjs@1.8.21/dayjs.min.js').subscribe(() => {
      console.log('Script loaded successfully')
    })
    scriptLoad$('https://unpkg.com/dayjs@1.8.21/dayjs.NOPE.js').pipe(debounceTime(100)).subscribe(
      () => console.log('Script loaded successfully'),
      error => console.error(error)
    )
  }

}
