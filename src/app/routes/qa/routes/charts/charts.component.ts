import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { user } from './user';
import { transfers } from './transfers';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnInit {

  public frame = 1;

  public dataSets: Chart.ChartDataSets[];

  public dataPoints: CanvasJS.ChartDataPoint[];
  public dataPoints2: CanvasJS.ChartDataPoint[];

  public user = user;
  public labels: string[];

  constructor() { }

  ngOnInit() {
    
    //this.labels = this.user.map(elem => elem.Time);
    //this.dataSets = [{
    //  label: this.user[0].name,
    //  data: this.user.map(elem => elem.talktime)
    //}];

    this.dataPoints = this.user.map(elem => {
      return <CanvasJS.ChartDataPoint>{
        label: elem.Time,
        y: elem.talktime
      }
    });

    this.dataPoints2 = transfers.map(transfer => {
      return <CanvasJS.ChartDataPoint>{
        label: transfer.name,
        y: transfer.Transfers
      }
    });

    const transfersByAgent: {[key:string] : any[]} = {};

    transfers.forEach(transfer => {
      if (!transfersByAgent[transfer.name]) {
        transfersByAgent[transfer.name] = [];
      }
      transfersByAgent[transfer.name].push(transfer);
    });

    console.log(transfersByAgent);

  }

  public formatTooltip(val: CanvasJS.ChartLabelFormatter):string {
    //console.log(val)
    return val.label + '!!';
  }

  public tooltipTemplate(model: Chart.ChartTooltipItem) {
    console.log(model);
    return `<h1>${this.dataSets[0].label}: ${model.yLabel}</h1>`
  }

}
