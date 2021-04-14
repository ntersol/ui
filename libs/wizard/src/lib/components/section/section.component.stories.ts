import { text, number, boolean } from '@storybook/addon-knobs';
import { SectionComponent } from './section.component';

export default {
  title: 'SectionComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: SectionComponent,
  props: {
    section: text('section', ),
  }
})