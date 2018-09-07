import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';

// import { Chart } from 'chart.js/dist/Chart.min.js';
// Import version of chartJS withOUT moment.js
const ChartJS = require('chart.js/dist/Chart.min.js');

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

  /** Show or hide the tooltip which appears when you hover over a chart entry */
  @Input() showTooltip = true;
  /** Show or hide the labels that appear on the X axis */
  @Input() showXAxisLabels = true;
  /** Show or hide the labels that appear on the Y axis */
  @Input() showYAxisLabels = true;

  private chart: Chart;
  private ctx: any;

  /** Default chart options, will be overriden by any passed down through options */
  private optionsDefault: Chart.ChartOptions = {
    maintainAspectRatio: false,
    tooltips: {
      enabled: this.showTooltip
    },
    scales: {
      xAxes: [{
        display: this.showXAxisLabels,
      }],
      yAxes: [{
        display: this.showYAxisLabels,
      }]
    }
  };

  /** After initial load */
  private isLoaded = false;

  constructor() {}

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
    if (this.element && this.element.nativeElement) {
      this.ctx = this.element.nativeElement.getContext('2d');
      const options = this.chartOptionsCreate();
      this.chart = new ChartJS(this.ctx, options);
      
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

    if (this.labels) {
      chartConfiguration.data.labels = this.labels;
    }

    return chartConfiguration;
  }


  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
