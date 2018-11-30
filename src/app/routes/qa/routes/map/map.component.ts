import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Models } from '$models';

@Component({
  selector: 'app-map-route',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {

  public locations: Location[];

  constructor(private http: HttpClient, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get('assets/mock-data/map-data.json').subscribe((data: any) => {
      const locations: Models.Location[] = data;
      this.locations = locations.map(location => {
        return <Location>{
          metadata: {
            title: location.display_address,
            description: location.city + ' ' + location.zip_code
          },
          latitude: location.display_lat, 
          longitude: location.display_lng
        };
      });
      this.ref.markForCheck();
    });

  }
}
