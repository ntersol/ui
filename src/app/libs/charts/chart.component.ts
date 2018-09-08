import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { formatDate, formatNumber, formatCurrency, formatPercent } from '@angular/common';

// Import version of chartJS without moment.js. Types are provided by the .d file in this folder
// import 'chart.js/dist/Chart.min.js';
// import 'chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js';
// const ChartJS = require('chart.js/dist/Chart.min.js');
// const DataLabels = require('chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js');
declare global {
  interface Window {
    Chart: any;
  }
}

interface FormatData {
  pipe: 'Date' | 'Currency' | 'Number' | 'Percent',
  format: string;
}

interface Formatter {
  (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData): string;
}

const chartSrc = 'assets/scripts/chart.min.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /** TEMP */
  @ViewChild('element')
  element: ElementRef;

  @Input() chartType: Chart.ChartType = 'bar';
  @Input() width: string;
  @Input() height: string;
  @Input() dataSets: Chart.ChartDataSets[];
  @Input() labels: string[];
  @Input() options: Chart.ChartOptions;

  // Format Elements
  @Input() formatTooltip: FormatData | Formatter;
  @Input() formatDatalabel: FormatData | Formatter;
  @Input() formatXLabels: FormatData | Formatter;
  @Input() formatYLabels: FormatData | Formatter;

  // Show/Hide Elements
  /** Show or hide the tooltip which appears when you hover over a chart entry */
  @Input() showLegend = true;
  /** Show or hide the values that appear inside the chart */
  @Input() showDataLabels = true;
  /** Show or hide the tooltip which appears when you hover over a chart entry */
  @Input() showTooltip = true;
  /** Show or hide the labels that appear on the X axis */
  @Input() showXAxisLabels = true;
  /** Show or hide the labels that appear on the Y axis */
  @Input() showYAxisLabels = true;

  // Titles
  /** Title to show for the main chart */
  @Input() titleChart: string;
  /** Title to show for the X Axis, leave null for none */
  @Input() titleXAxis: string;
  /** Title to show for the Y Axis, leave null for none */
  @Input() titleYAxis: string;

  //public chartJs = ChartJS;
  //public dataLabels = DataLabels;

  private chart: Chart;

  /** Default chart options, will be overriden by anything passed down through @Input options */
  private optionsDefault: Chart.ChartOptions = {
    maintainAspectRatio: false,
    title: {
      display: this.titleChart ? true : false,
      text: this.titleChart,
    },
    legend: {
      display: this.showLegend,
    },
    tooltips: {
      enabled: this.showTooltip
    },
    scales: {
      xAxes: [
        {
          display: this.showXAxisLabels,
          scaleLabel: {
            display: this.titleXAxis ? true : false,
            labelString: this.titleXAxis,
          },
        },
      ],
      yAxes: [
        {
          display: this.showYAxisLabels,
          scaleLabel: {
            display: this.titleYAxis ? true : false,
            labelString: this.titleYAxis,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        display: true,
      },
    },
  };

  /** After initial load */
  private isLoaded = false;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.scriptsLoad();
  }

  ngOnChanges() {
    // Only update chart
    if (this.isLoaded) {
      this.chartInit();
    }
  }

  /**
   * Check if Chart.js is loaded, if not, load it then initialize the chart in this component
   */
  public scriptsLoad() {
    if (window.Chart) {
      this.chartInit(); // Chart.js already loaded, init chart
      this.isLoaded = true;
    } else {
      const script = document.createElement('script');
      script.src = chartSrc;
      script.onload = () => {
        this.chartInit();
        this.isLoaded = true;
      }; // After load, init chart
      document.head.appendChild(script);
    }
  }

  /**
   * Initialize the chart
   */
  private chartInit() {
    if (this.element && this.element.nativeElement && window.Chart) {
      // Clean up any previous references before reinitializing the chart
      this.ngOnDestroy();
      const options = this.chartOptionsCreate();

      // Create chart from WINDOW reference not import
      // Due to bug with plugins registered with global object and not being available via imports
      this.chart = new window.Chart(this.element.nativeElement.getContext('2d'), this.chartOptionsCreate());

      console.log(options);
    }
  }

  /**
   * Create the options needed by this chart
   */
  private chartOptionsCreate() {
    const chartConfiguration: Chart.ChartConfiguration = {
      type: this.chartType,
      data: {},
      // Ensure default options are present
      options: {
        ...this.optionsDefault,
        ...this.options,
      },
    };

    // Attach datasets
    if (this.dataSets) {
      chartConfiguration.data.datasets = this.dataSets;
    }

    // If custom labels passed, use this
    if (this.labels) {
      chartConfiguration.data.labels = this.labels;
    } else if (this.dataSets.length === 1) {
      // If only 1 dataset, generate the labels automatically from the values so they show on the x Axis
      chartConfiguration.data.labels = (<any>this).dataSets[0].data.map((val: number) => String(val));
    }

    // If tooltip formatter supplied
    if (this.formatTooltip) {
      chartConfiguration.options.tooltips.callbacks = {
        ...chartConfiguration.options.tooltips.callbacks,
        label: this.formatData(this.formatTooltip),
      };
    }

    // If tooltip formatter supplied
    if (this.formatYLabels) {
      chartConfiguration.options.scales.yAxes = [{
        ticks: {
          callback: this.formatData(this.formatYLabels),
        }
      }]
    }

    return chartConfiguration;
  }

  private formatData(option: FormatData | Formatter) {
    console.log('option',option)
    // Check if a custom formatter was supplied, if not use angular pipe
    if (typeof option !== 'function' && option.pipe) {
      switch (option.pipe) {
        // Use decimal pipe
        case 'Number':
          return (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData) =>
            formatNumber(Number(tooltipItem.yLabel), 'en-US', option.format);
        // Datepipe
        case 'Date':
          return (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData) =>
            formatDate(Number(tooltipItem.yLabel), option.format, 'en-US');
        // Currency pipe
        case 'Currency':
          return (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData) =>
            formatCurrency(Number(tooltipItem.yLabel), 'en-US', '', option.format);
        // Percent pipe
        case 'Percent':
          return (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData) =>
            formatPercent(Number(tooltipItem.yLabel), 'en-US', option.format);
        default:
          console.warn('Improper values supplied for chart formatter', option);
          break;
      }
    } else {
      return <Formatter>option;
    }

  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
