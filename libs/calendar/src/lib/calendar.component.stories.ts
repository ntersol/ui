import { FullCalendarModule } from '@fullcalendar/angular';
import { text } from '@storybook/addon-knobs';
import { CalendarComponent } from './calendar.component';

export default {
  title: 'CalendarComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: [FullCalendarModule]
  },
  component: CalendarComponent,
  props: {
    defaultView: text('defaultView', 'dayGridMonth'),
    height: text('height', '500')
  }
})
