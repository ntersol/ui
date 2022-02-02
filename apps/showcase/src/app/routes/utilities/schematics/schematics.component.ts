import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HighlightService } from '../../../shared/services/highlight.service';

@Component({
  selector: 'app-schematics',
  templateUrl: './schematics.component.html',
  styleUrls: ['./schematics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchematicsComponent implements OnInit, AfterViewInit, OnDestroy {
  name = 'schematics';
  public enabled = false;
  public opened = false;
  public setupTS: string = `
    // Install
    npm install @ntersol/schematics

    // Add
    ng add @ntersol/schematics

    // Configure (Note: done automatically by ng-add)
    ng config cli.defaultCollection @ntersol/schematics

    // Add Route
    ng g route --name home (or whatever you'd like to call it)
  `;

  constructor(public highlight: HighlightService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.highlight.highlightAll();
  }

  ngOnDestroy() {}
}
