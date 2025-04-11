import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppItem } from '@core/models/app-item.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppListService {
  constructor(private _http: HttpClient) {}

  getApplications(): Observable<AppItem[]> {
    return this._http.get<AppItem[]>(environment.appsUrl);
  }
}
