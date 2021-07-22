import { Component, AfterViewInit } from '@angular/core';
import { HighlightService } from '../../shared/services/highlight.service';

type sizes = 'sm' | 'md' | 'lg' | 'md-up';

@Component({
  selector: 'nts-show-visible',
  templateUrl: './visible.component.html',
  styleUrls: ['./visible.component.scss']
})
export class VisibleComponent implements AfterViewInit {

  public exampleTS =
    `
  type sizes = 'sm' | 'md' | 'lg' | 'md-up';
  public visibleSize: sizes = 'sm';

  // isVisible fires when the breakpoint is hit on window resize
  public showVisibilityStatus(isVisible: boolean): void {
    console.log(isVisible);
  }`;
  public exampleHTML = `
  &#060;nts-visible visible=&quot;visibleSize&quot; (isVisible)=&quot;showVisibilityStatus($event)&quot;&#062;&#060;/nts-visible&#062;`;


  constructor(private highlight: HighlightService) { }

  showVisibilityStatus(visibility: any, size: sizes): void {
    console.log(`Content ${size} is visible: ${visibility}`);
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}
