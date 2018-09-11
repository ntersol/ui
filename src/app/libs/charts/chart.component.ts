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
  pipe: 'date' | 'currency' | 'number' | 'percent',
  format?: string;
}

interface Formatter {
  (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData): string;
}

interface TemplateTooltip {
  (tooltipItem: Chart.ChartTooltipItem): string;
}
// JS file source
const chartSrc = 'assets/scripts/chart.min.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /** TEMP */
  @ViewChild('element') element: ElementRef;
  @ViewChild('tooltipCustom') tooltipCustom: ElementRef;

  @Input() chartType: Chart.ChartType = 'bar';
  @Input() width: string;
  @Input() height: string;
  @Input() dataSets: Chart.ChartDataSets[];
  @Input() labels: string[];
  @Input() options: Chart.ChartOptions;
  @Input() stacked: boolean;
  /** Colors for data points in RGB */
  @Input() chartColors = [[186, 0, 0], [153, 102, 255], [75, 192, 192], [255, 159, 64], [255, 205, 86],[54, 162, 235]];

  // Format Elements
  @Input() formatTooltip: FormatData | Formatter;
  @Input() formatTooltipTitle: FormatData | Formatter;
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

  // Template
  /** Supply a custom html template for the tooltip */
  @Input() templateTooltip: TemplateTooltip = null;

  //public chartJs = ChartJS;
  //public dataLabels = DataLabels;

  private ctx: any;
  private chart: Chart;
  
  
  //private chartColorsDict = {
  //  blue: 'rgb(54, 162, 235)',
  //  green: 'rgb(75, 192, 192)',
  //  grey: 'rgb(201, 203, 207)',
  //  orange: 'rgb(255, 159, 64)',
  //  purple: 'rgb(153, 102, 255)',
  //  red: 'rgb(255, 99, 132)',
  //  yellow: 'rgb(255, 205, 86)'
  //}


  /** After initial load */
  private isLoaded = false;

  constructor() {}

  ngOnInit() {
   
  }

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
    if (this.element && this.element.nativeElement && window.Chart && this.dataSets) {
      // Clean up any previous references before reinitializing the chart
      this.ngOnDestroy();
     
      // Get context
      this.ctx = this.element.nativeElement.getContext('2d');
      
      // Create chart from WINDOW reference not import
      // Due to bug with plugins registered with global instance and not being available via imports
      this.chart = new window.Chart(this.ctx, this.chartOptionsCreate());
      
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
        ...this.optionsCreateDefaults(),
        ...this.options,
      },
    };

    // Attach datasets
    if (this.dataSets) {
      chartConfiguration.data.datasets = [...this.dataSets];
      chartConfiguration.data.datasets = chartConfiguration.data.datasets.map((set,i) => {
        if (!set.backgroundColor) {
          console.log(set);
          const gradient = this.ctx.createLinearGradient(0, 0, 0, 600); // 600 is the height of the gradient, play with this to get good gradient mixes
          const color = this.chartColors[i] || this.chartColors[0];
          const colorJoined = color.join(', ');
          gradient.addColorStop(0, `rgb(${colorJoined},.1)`);
          gradient.addColorStop(1, `rgb(${colorJoined},1)`);
          set.backgroundColor = gradient;
          set.borderColor = `rgb(${colorJoined},1)`;
          set.borderWidth = .5;
        }
        return set;
      })
    }

    // If custom labels passed, use this
    if (this.labels) {
      chartConfiguration.data.labels = this.labels;
    } else if (this.dataSets.length === 1) {
      // If only 1 dataset, generate the labels automatically from the values so they show on the x Axis
      chartConfiguration.data.labels = (<any>this).dataSets[0].data.map((val: number) => String(val));
    }

    // If custom tooltip template is passed
    if (this.templateTooltip) {
      chartConfiguration.options.tooltips = {
        ...chartConfiguration.options.tooltips,
        enabled: false,
        custom: (toolTipData: Chart.ChartTooltipCustom) => {

          console.log(toolTipData);
          
          if (this.tooltipCustom && this.tooltipCustom.nativeElement) {
            // Get DOM reference
            const tooltip = this.tooltipCustom.nativeElement;

            tooltip.style.opacity = toolTipData.opacity;

            if (toolTipData.opacity) {
              // Get data for this entry
              const data = toolTipData.dataPoints && toolTipData.dataPoints.length ? toolTipData.dataPoints[0] : null;
              // Get the position of this charting element
              const position = this.chart.canvas.getBoundingClientRect();

              // Update tooltip styles
              tooltip.style.left = position.left + toolTipData.caretX + 'px';
              tooltip.style.top = position.top + toolTipData.caretY + 'px';

              tooltip.innerHTML = this.templateTooltip(data);
            }
          }
        }
      }
    }

    // If tooltip formatter supplied
    if (this.formatTooltip) {
      chartConfiguration.options.tooltips.callbacks = {
        ...chartConfiguration.options.tooltips.callbacks,
        label: this.formatData(this.formatTooltip),
      };
    }

    // If tooltip title formatter supplied
    if (this.formatTooltipTitle) {
      chartConfiguration.options.tooltips.callbacks = {
        ...chartConfiguration.options.tooltips.callbacks,
        title: null//this.formatData(this.formatTooltipTitle),
      };
    }

    // If tooltip formatter supplied
    if (this.formatYLabels) {
      chartConfiguration.options.scales.yAxes = [{
        ticks: {
          callback: this.formatData(this.formatYLabels),
        }
      }];
    }

    // If tooltip formatter supplied
    if (this.formatXLabels) {
      chartConfiguration.options.scales.xAxes = [{
        ticks: {
          callback: this.formatData(this.formatXLabels),
        }
      }];
    }

    return chartConfiguration;
  }

  /**
   * Create the default set of options that are passed down from the @Inputs
   */
  private optionsCreateDefaults() {
    const options: Chart.ChartOptions = {
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
            ticks: {},
            stacked: this.stacked
          },
        ],
        yAxes: [
          {
            display: this.showYAxisLabels,
            scaleLabel: {
              display: this.titleYAxis ? true : false,
              labelString: this.titleYAxis,
            },
            ticks: {},
            stacked: this.stacked
          },
        ],
      },
      plugins: {
        datalabels: {
          display: this.showDataLabels,
        },
      },
    };

    // Default formatter for numbers and labels
    // Check if Y axis default value is a number, if so default to use Angular number pipe
    if (typeof this.dataSets[0].data[0] === 'number') {
      options.scales.yAxes[0].ticks.callback = (val: number | string) => formatNumber(Number(val), 'en-US', '1.0-0');
      options.plugins.datalabels.formatter = (val: number | string) => formatNumber(Number(val), 'en-US', '1.0-0');
    }

    // Check if label value is a number, if so default to Angular number pipe
    if (typeof this.labels[0] === 'number') {
      options.scales.xAxes[0].ticks.callback = (val: number | string) => formatNumber(Number(val), 'en-US', '1.0-0');
    }

    // Check if label value is a number, if so default to Angular number pipe
    //if (typeof this.labels[0] === 'string' && this.labels[0].indexOf(':') !== -1) {
    //  options.scales.xAxes[0].ticks.callback = (val: number | string) => {
    //    console.log(val);
    //    return formatDate(val, 'en-US', 'h:mm a')
    //  };
    //}

    return options;
  }



  /**
   * Supply a formatter method OR an Angular pipe to the chart instance
   * Used to format labels, values, datalabels, etc
   * @param option
   */
  private formatData(option: FormatData | Formatter) {
    // Check if a custom formatter was supplied, if not use angular pipe
    if (typeof option !== 'function' && option.pipe) {
      let format = option.format;

      if (!option.format) {
        format = '';
      }

      switch (option.pipe) {
        // Use decimal pipe
        case 'number':
          return (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData) =>
            formatNumber(Number(tooltipItem.yLabel), 'en-US', format);
        // Datepipe
        case 'date':
          return (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData) =>
            formatDate(Number(tooltipItem.yLabel), format, 'en-US');
        // Currency pipe
        case 'currency':
          return (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData) =>
            formatCurrency(Number(tooltipItem.yLabel), 'en-US', '', format);
        // Percent pipe
        case 'percent':
          return (tooltipItem: Chart.ChartTooltipItem, _data: Chart.ChartData) =>
            formatPercent(Number(tooltipItem.yLabel), 'en-US', format);
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
