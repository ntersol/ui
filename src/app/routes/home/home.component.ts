import { Component, OnInit, ViewChild, ChangeDetectionStrategy, TemplateRef, ViewEncapsulation, OnDestroy, ElementRef} from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, Subscription } from "rxjs";
import 'rxjs/add/operator/map';
import { ApiService, UIService, ApiProps} from 'app-shared';


@Component({
    selector: 'home',
    styleUrls: [ './home.component.scss' ],
    templateUrl: './home.component.html',
    //encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy{
	
	private subs: Subscription[] = [];
    
	constructor(
		private api: ApiService,
		private ui: UIService
	) {
	}
    
	public ngOnInit() {
		
	}


  ngOnDestroy() {
		if (this.subs.length) {
			this.subs.forEach(sub => sub.unsubscribe());
  	}
  }
    

	
}
