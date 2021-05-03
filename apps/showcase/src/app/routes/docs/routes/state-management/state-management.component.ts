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
    this.users$.subscribe(x => console.log(x.data));
    this.domain.users.get().subscribe();

    this.domain.post.state$.subscribe(x => console.log(x.data));
    // this.domain.users.post().subscribe();
    // this.domain.post.state$.subscribe(x => console.log(x));
    // this.domain.post.get().subscribe();

    /**
    this.domain.users.get().subscribe();
    this.domain.users.get().subscribe();

    setTimeout(() => {
      this.domain.users.refresh().subscribe();
    }, 2000);
     */
  }
}
