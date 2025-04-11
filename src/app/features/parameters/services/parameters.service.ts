import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Parameters } from '@features/parameters/models/parameters.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  constructor(private _http: HttpClient) {}

  getParameters(): Observable<Parameters[]> {
    return this._http.get<Parameters[]>(
      `${environment.dataUrl}/parameters.json`,
    );
  }
}
