import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HighlightService } from '../../shared/services/highlight.service';

@Component({
  selector: 'app-schematics',
  templateUrl: './schematics.component.html',
  styleUrls: ['./schematics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchematicsComponent implements OnInit, OnDestroy {
  name = 'schematics';
  public enabled = false;
  public opened = false;
  public addTS: string = `
    ng add @ntersol/schematics
    `;
  public configTS = `
    ng config cli.defaultCollection @ntersol/schematics
  `;
  public generateTS = `
    ng g route --name home --path src/app/routes
    `;
  public generateWithStoresTS = `
    ng g route --name home --path src/app/routes --apiStore --uiStore
    `;
  constructor(public highlight: HighlightService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.highlight.highlightAll();
  }

  ngOnDestroy() {}
}
