import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-angular-starter',
  templateUrl: './angular-starter.component.html',
  styleUrls: ['./angular-starter.component.css'],
})
export class AngularStarterComponent implements OnInit {
  public install = `
# Clone the repo
git clone https://github.com/ntersol/angular-starter.git

# Rename directory from "angular-starter" to "your-app"

# Change directory to the repo
cd your-app

# Install the repo with npm
npm i`;

  constructor(private highlight: HighlightService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
