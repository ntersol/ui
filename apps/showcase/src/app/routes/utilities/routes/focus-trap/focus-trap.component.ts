import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-focus-trap',
  templateUrl: './focus-trap.component.html',
  styleUrls: ['./focus-trap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocusTrapComponent implements AfterViewInit {
  public enabled = false;
  public opened = false;
  public exampleTS: string = `
    // Declare in your module
    import { FocusTrapDirective } from '@ntersol/utils';

    @NgModule({
      imports: ...,
      declarations: [..., FocusTrapDirective],
    })
  `;
  public exampleHTML: string = `
    <!-- Use in your HTML like so -->
    <div [ntsFocusTrap]="enabled">
        <div class="content">
            <input p-input type="color" name="color" id="color">
            <input p-input type="date" name="date" id="date">
            <input p-input type="text" name="name" id="name">
            <input p-input type="button" value="Submit">
        </div>
    </div>
  `;

  constructor(public highlight: HighlightService) { }


  ngAfterViewInit(): void {
    this.highlight.highlightAll();
  }
}
