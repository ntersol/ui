import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-input-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsTextComponent extends NtsInputComponent<string> implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
