import { Component, OnInit } from '@angular/core';
import { scriptLoad$ } from '@ntersol/utils';
import { debounceTime } from 'rxjs/operators';
import { HighlightService } from '../../../../shared/services/highlight.service';

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
    scriptLoad$('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.js').subscribe(() => {
      // Script loaded successfully
    })

    // Now with pipeable operator goodness and error handling
    scriptLoad$('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.BAD.js').pipe(debounceTime(100)).subscribe(
      () => console.log('Script loaded successfully'),
      error => console.error(error)
    )`;

  constructor(private highlight: HighlightService) { }

  ngOnInit(): void {
    scriptLoad$('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.js').subscribe(() => {
      console.log('Script loaded successfully')
    })
    scriptLoad$('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.BAD.js').pipe(debounceTime(100)).subscribe(
      () => console.log('Script loaded successfully'),
      error => console.error(error)
    )
  }



  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}