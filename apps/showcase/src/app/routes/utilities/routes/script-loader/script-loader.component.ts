import { Component, OnInit } from '@angular/core';
import { scriptLoad$ } from '@ntersol/utils';
import { debounceTime } from 'rxjs/operators';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-script-loader',
  templateUrl: './script-loader.component.html',
  styleUrls: ['./script-loader.component.css'],
})
export class ScriptLoaderComponent implements OnInit {
  public exampleTS: string = `
    // Import util
    import { scriptLoad$ } from '@ntersol/utils';

    // Single request
    scriptLoad$('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.js').subscribe(() => {
      // Script loaded successfully
    });

    // Load multiple scripts in parallel (if execution order doesn't matter)
    scriptLoad$(['https://unpkg.com/dayjs@1.8.21/dayjs.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js']).subscribe(() => {
      // Scripts loaded successfully
    });

    // If execution order matters
    // This example loads dayjs core and then after it finishes loads the plugins
    scriptLoad$('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.js').pipe(
      switchMap(() => scriptLoad$([
        'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/plugin/calendar.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/plugin/isoWeek.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/plugin/utc.min.js']))
    ).subscribe(() => {
      // All scripts loaded successfully
    });

    // Now with pipeable operator goodness and error handling
    scriptLoad$('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.BAD.js').pipe(debounceTime(100)).subscribe(
      () => console.log('Script loaded successfully'),
      error => console.error(error)
    );`;

  constructor(private highlight: HighlightService) {}

  ngOnInit(): void {
    scriptLoad$('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.js').subscribe(() => {
      console.log('Script loaded successfully');
    });

    scriptLoad$('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.BAD.js')
      .pipe(debounceTime(100))
      .subscribe(
        () => console.log('Script loaded successfully 2'),
        (error) => console.error(error),
      );
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
