import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { addSeconds, format, startOfDay } from 'date-fns';
import { differenceInSeconds } from 'date-fns/esm';
import { timer } from 'rxjs';
import { map, startWith, timestamp } from 'rxjs/operators';

import { NtsTimerService } from './timer.service';
import { coalesce } from '../../utils';

@Component({
  selector: 'nts-timer',
  template: `
    {{ timer | async | map: formatter }}
  `,
  styles: [``],
  providers: [NtsTimerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit {
  @Input()
  timerId = 'global';
  @Input()
  formatter: (seconds: number | null) => string = seconds =>
    format(addSeconds(startOfDay(this.start), coalesce(0)(seconds)), 'HH:mm:ss');

  start = Date.now();
  readonly timer = timer(0, 500).pipe(
    timestamp(),
    map(({ timestamp }) => differenceInSeconds(timestamp, this.start)),
    startWith(0),
  );

  constructor(readonly timerSvc: NtsTimerService) {}

  ngOnInit(): void {
    this.start = this.timerSvc.addTimer(this.timerId);
  }
}
