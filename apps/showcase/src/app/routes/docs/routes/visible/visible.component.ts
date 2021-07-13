import { Component, OnInit } from '@angular/core';

type sizes = 'sm' | 'md' | 'lg' | 'md-up';

@Component({
  selector: 'nts-visible',
  templateUrl: './visible.component.html',
  styleUrls: ['./visible.component.scss']
})
export class VisibleComponent implements OnInit {

  public exampleTS: string =
    `
  type sizes = 'sm' | 'md' | 'lg' | 'md-up';
  public visibleSize: sizes = 'sm';

  // isVisible fires when the breakpoint is hit on window resize
  public showVisibilityStatus(isVisible: boolean): void {
    console.log(isVisible);
  }`;
  public exampleHTML: string = `
  &#060;div [visible]=&quot;visibleSize&quot; (isVisible)=&quot;showVisibilityStatus($event)&quot;&#062;&#060;/div&#062;`;


  constructor() { }

  ngOnInit(): void { }

  showVisibilityStatus(visibility: boolean, size: sizes): void {
    console.log(`Content ${size} is visible: ${visibility}`);
  }

}
