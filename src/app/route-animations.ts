import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(0.95)'
      }),
    ], { optional: true }),
    query(':enter', [
      animate('400ms ease',
        style({
          opacity: 1,
          transform: 'scale(1)'
        })
      ),
    ], { optional: true })
  ])
]);