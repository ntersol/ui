import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-text',
  templateUrl: '../input/input.component.html',
  styleUrls: ['./text.component.scss', '../input/input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsTextComponent extends NtsInputComponent<string> implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
