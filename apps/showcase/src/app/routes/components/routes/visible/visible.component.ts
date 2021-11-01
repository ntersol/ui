import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { MediaBreakpoints } from '@ntersol/visible'

@Component({
  selector: 'nts-visible',
  templateUrl: './visible.component.html',
  styleUrls: ['./visible.component.scss']
})
export class VisibleComponent implements OnInit {

  public exampleimport2 = this.highlight.htmlEncode(`
  // Import module
  import { NtsVisibleModule } from '@ntersol/visible';

  // Add module to imports. If you miss this step the breakpoints won't work
  @NgModule({
    imports: [..., NtsVisibleModule],
    declarations: [],
    providers: [],
    exports: [],
    entryComponents: [],
  })
  export class ComponentsModule { }`);

  public exampleTS: string =
    `
  // Import available sizes
  import { MediaBreakpoints } from '@ntersol/visible'

  // Select a breakpoint
  public visibleSize: MediaBreakpoints = 'sm';

  // isVisible fires when the breakpoint is hit on window resize
  public showVisibilityStatus(isVisible: boolean): void {
    console.log(isVisible);
  }`;
  public exampleHTML: string = this.highlight.htmlEncode(`
  <div visible="lg">Content lg</div>
  <!-- Or configurable -->
  <div [visible]=visibleSize" (isVisible)="showVisibilityStatus($event)"></div>`);


  constructor(private highlight: HighlightService) { }

  ngOnInit(): void { }

  showVisibilityStatus(visibility: any, size: MediaBreakpoints): void {
    console.log(`Content ${size} is visible: ${visibility}`);
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}
