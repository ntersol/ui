import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';

// Import version of chartJS without moment.js. Types are provided by the .d file in this folder
import 'chart.js/dist/Chart.min.js';
import 'chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js';
// const ChartJS = require('chart.js/dist/Chart.min.js');
// const DataLabels = require('chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js');


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /** TEMP */
  @ViewChild('element') element: ElementRef;
  
  @Input() chartType: Chart.ChartType = 'bar';
  @Input() width: string;
  @Input() height: string;
  @Input() dataSets: Chart.ChartDataSets[];
  @Input() labels: string[];
  @Input() options: Chart.ChartOptions;

  @Input() tooltip: Chart.ChartTooltipOptions;

  // Format Elements
  @Input() formatTooltip: Function;
  @Input() formatDataLabel: Function;
  @Input() formatXLabels: Function;
  @Input() formatYLabels: Function;

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
  /** Show or hide the labels that appear on the X axis */
  @Input() showXAxisTitle = false;
  /** Show or hide the labels that appear on the Y axis */
  @Input() showYAxisTitle = false;

  //public chartJs = ChartJS;
  //public dataLabels = DataLabels;

  private chart: Chart;
  //public dataLabels = DataLabels;
  private ctx: any;

  /** Default chart options, will be overriden by anything passed down through @Input options */
  private optionsDefault: Chart.ChartOptions = {
    maintainAspectRatio: false,
    legend: {
      display: this.showLegend,
    },
    tooltips: {
      enabled: this.showTooltip,
      callbacks: {
        label: function (tooltipItem, _data) {
          return tooltipItem.yLabel + 100;
        }
      }
    },
    scales: {
      xAxes: [{
        display: this.showXAxisLabels,
        scaleLabel: {
          display: this.showXAxisTitle,
          labelString: 'This is the X Axis'
        }
      }],
      yAxes: [{
        display: this.showYAxisLabels,
        scaleLabel: {
          display: this.showYAxisTitle,
          labelString: 'This is the Y Axis'
        }
      }],
    },
    plugins: {
      datalabels: {
        display: true,
      }
    }
  };

  /** After initial load */
  private isLoaded = false;

  constructor() {
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.chartInit();
    this.isLoaded = true;
  }
  
  ngOnChanges() {
    // Only update chart
    if (this.isLoaded) {
      this.chart.update();
    }
  }

  /**
   * Initialize the chart
   */
  private chartInit() {
    if (this.element && this.element.nativeElement && (<any>window).Chart) {
      this.ctx = this.element.nativeElement.getContext('2d');
      const options = this.chartOptionsCreate();
      // Create chart from WINDOW reference not import
      // Due to bug with plugins registered with global object and not being available via imports
      this.chart = new (<any>window).Chart(this.ctx, this.chartOptionsCreate());
     
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
        ...this.options
      }
    };
    
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

    return chartConfiguration;
  }


  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
