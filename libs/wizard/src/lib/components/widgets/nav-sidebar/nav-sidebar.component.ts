import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WizardStateService } from '../../../shared/store/wizard.state.service';

@Component({
  selector: 'nts-wizard-nav-sidebar',
  templateUrl: './nav-sidebar.component.html',
  styleUrls: ['./nav-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizNavSidebarComponent implements OnInit {

  constructor(public state: WizardStateService) { }

  ngOnInit(): void {
  }

}
