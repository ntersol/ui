import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HighlightService } from '../../shared/services/highlight.service';

@Component({
  selector: 'app-schematics',
  templateUrl: './schematics.component.html',
  styleUrls: ['./schematics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchematicsComponent implements OnInit, AfterViewInit {
  public addTS: string = `
    ng add @ntersol/schematics
    `;
  public configTS = `
    ng config cli.defaultCollection @ntersol/schematics
  `;
  public generateTS = `
    ng g route src/app/routes/<feature-folder>/<feature-name>
    ng g route src/app/routes/feature/feature
    `;
  public generateWithStoresTS = `
    ng g r --name home --path src/app/routes --apiStore --uiStore
    `;
  constructor(public highlight: HighlightService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.highlight.highlightAll();
  }
}
