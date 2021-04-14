import { text, number, boolean } from '@storybook/addon-knobs';
import { ContentComponent } from './content.component';

export default {
  title: 'ContentComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: ContentComponent,
  props: {
    content: text('content', ),
    dataField: text('dataField', ),
    templates: text('templates', {}),
  }
})