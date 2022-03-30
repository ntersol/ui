import { animate, query, style, AnimationQueryMetadata, transition, trigger } from '@angular/animations';

export const FADE = trigger('fade', [
  transition('void => *', [style({ opacity: 0 }), animate(300, style({ opacity: 1 }))]),
  transition('* => void', [animate(300, style({ opacity: 0 }))]),
]);
