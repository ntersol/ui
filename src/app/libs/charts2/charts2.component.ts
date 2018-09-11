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
// import { formatDate, formatNumber, formatCurrency, formatPercent } from '@angular/common';

// Import version of chartJS without moment.js. Types are provided by the .d file in this folder
// import 'chart.js/dist/Chart.min.js';
// import 'chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js';
// const ChartJS = require('chart.js/dist/Chart.min.js');
// const DataLabels = require('chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js');

declare global {
  interface Window {
    CanvasJS: any;
  }
}

// JS file source
const chartSrc = 'assets/scripts/canvasjs.min.js';

@Component({
  selector: 'app-charts2',
  templateUrl: './charts2.component.html',
  styleUrls: ['./charts2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Charts2Component implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /** TEMP */
  @ViewChild('element') element: ElementRef;
  @ViewChild('tooltipCustom') tooltipCustom: ElementRef;

  @Input() type: 'line' | 'column' | 'bar' | 'area' | 'spline' | 'splineArea' | 'stepLine' | 'scatter' | 'bubble' | 'stackedColumn' | 'stackedBar' |
    'stackedArea' | 'stackedColumn100' | 'stackedBar100' | 'stackedArea100' | 'pie' | 'doughnut' = 'column';
  @Input() width: string;
  @Input() height: string;
  @Input() data: CanvasJS.ChartDataPoint[];
  @Input() options: CanvasJS.ChartOptions;
  @Input() stacked: boolean;

  /** Colors for data points in RGB */
  @Input() colorSet: string;
  @Input() colorsCustom: string[];

  // Format Elements
  @Input() formatTooltip: any;
  @Input() formatTooltipTitle: any;
  @Input() formatDatalabel: any;
  @Input() formatXLabels: any;
  @Input() formatYLabels: any;

  // Show/Hide Elements
  /** Show or hide the tooltip which appears when you hover over a chart entry */
  @Input() showLegend = true;
  /** Show or hide the values that appear inside the chart */
  @Input() showIndexLabel = false;
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
  @Input() templateTooltip: any = null;

  //public chartJs = ChartJS;
  //public dataLabels = DataLabels;

  /** Chart reference */
  private chart: CanvasJS.Chart;

  /** If custom colors supplied, this is the auto-generated name of the color scheme */
  private colorScheme: string;

  /** After initial load */
  private isLoaded = false;

  constructor() { }

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
    if (window.CanvasJS) {
      this.chartInit(); // Chart.js already loaded, init chart
      this.isLoaded = true;
    } else {
      const script = document.createElement('script');
      script.type = 'text/javascript';
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
    console.log(this.element.nativeElement)
    if (this.element && this.element.nativeElement && window.CanvasJS) { //  && this.dataSets
      // Clean up any previous references before reinitializing the chart
      this.ngOnDestroy();

      if (this.colorsCustom) {
        this.colorScheme = 'customColors-' + this.colorsCustom.join;
        window.CanvasJS.addColorSet(this.colorScheme, this.colorsCustom)
      }

      // Create chart from WINDOW reference not import
      // Due to bug with plugins registered with global instance and not being available via imports
      this.chart = new window.CanvasJS.Chart('chartContainer', this.chartOptionsCreate());

      this.chart.render();

    }
  }

  /**
   * Create the options needed by this chart
   */
  public chartOptionsCreate() {
   
    const options = <CanvasJS.ChartOptions>{
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: this.titleChart,
        fontSize: 18
      },
      toolTip: {
        enabled: this.showTooltip,
        fontColor: this.formatTooltip ? this.formatTooltip : null
      },
      colorSet: this.colorSet ? this.colorSet : this.colorScheme ? this.colorScheme : null, // Use build in color set if supplied, use custom colors if not
      data: [{
        type: this.type,
        showInLegend: this.showLegend,
        indexLabel: this.showIndexLabel ? '{x}' : null,
        indexLabelFontSize: 10,
        legendText: this.data[0].label,
        dataPoints: this.data
      }],
      axisX: {
        title: this.titleXAxis,
        titleFontSize: 16,
        labelFontSize: 12,
        labelFormatter: (val) => {
          if (this.showXAxisLabels === false) { 
            return ''; // If show labels is disabled, return empty string which hides the labels
          } else if (this.formatXLabels) {
            return this.formatXLabels(val); // If custom formatter supplied, format strings
          }
          return val.label; // Otherwise return default value
        }
      },
      axisY: {
        title: this.titleYAxis,
        titleFontSize: 16,
        labelFontSize: 12,
        labelFormatter: (val) => {
          if (this.showYAxisLabels === false) {
            return ''; // If show labels is disabled, return empty string which hides the labels
          } else if (this.formatYLabels) {
            return this.formatYLabels(val); // If custom formatter supplied, format strings
          }
          return val.value; // Otherwise return default value
        }
      },
    }

    // Return options object with overrides
    return {
      ...options,
      ...this.options
    };
  }


  /**
   * Supply a formatter method OR an Angular pipe to the chart instance
   * Used to format labels, values, datalabels, etc
   * @param option
   
  public formatData(option: FormatData | Formatter) {
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
  */

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
