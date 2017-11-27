import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { AppSettings } from '@shared';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

	constructor(
		private settings: AppSettings
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authReq = req.clone({
			headers: req.headers.set('Authorization', 'Bearer ' + this.settings.token)
		});
		return next.handle(authReq);
	}
}
