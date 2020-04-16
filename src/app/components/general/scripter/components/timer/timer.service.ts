import { Injectable } from '@angular/core';
import { isNil } from '../../utils';

@Injectable()
export class NtsTimerService {
  readonly timers: Record<string, number> = {
    global: Date.now(),
  };

  addTimer(timerId: string): number {
    if (isNil(this.timers[timerId])) {
      this.timers[timerId] = Date.now();
    }
    return this.timers[timerId];
  }

  getTimer(timerId: string): number {
    return this.addTimer(timerId);
  }

  remoteTimer(timerId: string): void {
    delete this.timers[timerId];
  }
}
