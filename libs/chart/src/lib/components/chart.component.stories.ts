import { text, boolean } from '@storybook/addon-knobs';
import { ChartComponent } from './chart.component';

export default {
  title: 'ChartComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [],
  },
  component: ChartComponent,
  props: {
    type: text('type', 'column'),
    width: text('width', ''),
    height: text('height', ''),
    // data: text('data', ),
    // options: text('options', ),
    stacked: boolean('stacked', false),
    color: text('color', '#000'),
    backgroundColor: text('backgroundColor', '#fff'),
    // limit: text('limit', ),
    colorSet: text('colorSet', ''),
    // colorGradient: text('colorGradient', ),
    // colorsCustom: text('colorsCustom', ),
    // formatTooltip: text('formatTooltip', ),
    // formatTooltipTitle: text('formatTooltipTitle', ),
    // formatDatalabel: text('formatDatalabel', ),
    // formatXLabels: text('formatXLabels', ),
    // formatYLabels: text('formatYLabels', ),
    showLegend: boolean('showLegend', true),
    showIndexLabel: boolean('showIndexLabel', false),
    showTooltip: boolean('showTooltip', true),
    showXAxisLabels: boolean('showXAxisLabels', true),
    showYAxisLabels: boolean('showYAxisLabels', true),
    // titleChart: text('titleChart', ),
    // titleXAxis: text('titleXAxis', ),
    // titleYAxis: text('titleYAxis', ),
    // templateTooltip: text('templateTooltip', null),
  },
});
