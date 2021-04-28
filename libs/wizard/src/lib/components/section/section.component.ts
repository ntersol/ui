import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { Wizard } from '../../wizard.models';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent implements OnInit {
  @Input() section?: Wizard.SectionControl;

  constructor() {}

  ngOnInit() {
    this.section;
  }
}
