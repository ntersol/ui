import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-input-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsTextComponent extends NtsInputComponent<string> implements OnInit {

  /** The MAXIMUM number of characters allowed by this input */
  @Input() maxlength: number | null = null;
  /** The MINIMUM number of characters allowed by this input */
  @Input() minlength: number | null = null;

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
