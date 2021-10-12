import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { libLoader$ } from '@ntersol/utils';

@Component({
  selector: 'nts-lib-loader',
  templateUrl: './lib-loader.component.html',
  styleUrls: ['./lib-loader.component.css']
})
export class LibLoaderComponent implements OnInit {

  public exampleTS: string =
    `
  // Import utility
  import { libLoader$ } from '@ntersol/utils';

  // Request a supported library, version and any optional plugins
  libLoader$({ lib: 'dayjs', version: '1.10.7', plugins: ['utc'] }).subscribe(dayjs => {
    // Use library
    console.warn(dayjs(new Date()));
  });

  libLoader$({ lib: 'jquery', version: '3.6.0' }).subscribe(jquery => {
    // Use library
    console.warn(jquery('body'));
  });`;

  constructor(private highlight: HighlightService) { }

  ngOnInit(): void {
    // Load DayJS
    libLoader$({ lib: 'dayjs', version: '1.10.7', plugins: ['utc'] }).subscribe(dayjs => {
      console.warn('DayJS', dayjs(new Date()));
    });

    // Load jQuery
    libLoader$({ lib: 'jquery', version: '3.6.0' }).subscribe(jquery => {
      console.warn('jQuery Loaded', jquery('body'));
    });
  }



  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
