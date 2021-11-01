import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { MtgCalcConfig } from '@ntersol/mtg-calc';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'app-mtg-calc',
  templateUrl: './mtg-calc.component.html',
  styleUrls: ['./mtg-calc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MtgCalcComponent implements AfterViewInit {
  public exampleTSInstall =
    `
  // Install the mtg-calc library
  npm i @ntersol/mtg-calc`;

  public html = this.highlight.htmlEncode(`
  <nts-mtg-calc [config]="config"></nts-mtg-calc>  `);

  public exampleTS = this.highlight.htmlEncode(
    `
    // Optionally Import config type to provide customizations
    import { NtsMtgCalc } from '@ntersol/mtg-calc';

    // Default config is as follows
    const DEFAULT: MtgCalcConfig = {
      interestRate: 5,
      loanAmount: 350000,
      showAmortization: true,
      termOptions: [{
          name: '15 Years',
          value: 15
      }, {
          name: '30 Years',
          value: 30
      }],
      terms: 30,
    }

    `);
  config: MtgCalcConfig = {
    loanAmount: 350000,
    terms: 30,
    interestRate: 3.5
  };
  constructor(private highlight: HighlightService) { }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}
