import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HighlightService } from '../../shared/services/highlight.service';

@Component({
  selector: 'app-schematics',
  templateUrl: './schematics.component.html',
  styleUrls: ['./schematics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchematicsComponent implements OnInit, AfterViewInit {
  public add: string = `
    ng add @ntersol/schematics
    `;
  public config = `
    ng config cli.defaultCollection @ntersol/schematics
  `;
  public generate = `
    ng g route src/app/routes/<name>
  `;
  public alias = `
    ng g r src/app/routes/feature
  `;
  public routing = `
    ng g r src/app/routes/feature --module app.routes --route path-of-feature
  `;
  public stores = `
    ng g r src/app/routes/feature --module app.routes --route path-of-feature --uiStore
  `;
  constructor(public highlight: HighlightService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.highlight.highlightAll();
  }
}
