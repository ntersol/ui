import { Component, ChangeDetectionStrategy } from '@angular/core';

// import { DomainService } from '$domain';
// import { UiStateService } from '$ui';

@Component({
  selector: 'nts-show-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
}
