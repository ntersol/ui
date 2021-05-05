import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StateManagementService } from './shared/state-management.service';

@Component({
  selector: 'nts-state-management',
  templateUrl: './state-management.component.html',
  styleUrls: ['./state-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementComponent implements OnInit {
  public users$ = this.domain.users.state$;

  constructor(private domain: StateManagementService) {}

  ngOnInit(): void {
    /**
    this.domain.users.get().subscribe();
    this.users$.subscribe(x => console.log(x));

    setTimeout(() => {
      this.domain.users.post({ name: 'Test' }).subscribe();
    }, 1000);

    setTimeout(() => {
      this.domain.users.put({ id: 2, name: 'Winning' }).subscribe();
    }, 1000);
     */

    this.domain.post.get().subscribe();
    this.domain.post.state$.subscribe(x => console.log(x));
  }
}
