import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CertificateField } from '@shared/models/interfaces/certificate.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {
  private readonly _API_URL:string = `${environment.API_URL}`;
  private _parameters: BehaviorSubject<CertificateField[]> = new BehaviorSubject<CertificateField[]>([]);

  parameter: Observable<CertificateField[]> = this._parameters.asObservable();

  constructor(private _http: HttpClient) {
    this.getParameters();
  }

  getParameters(): Observable<CertificateField[]> {
     return this._http.get<CertificateField[]>(
      `${this._API_URL}/api/certificate/parameter`)
       .pipe(
         tap((parameters: CertificateField[]) => {
         this._parameters.next(parameters)
       }))
  }

  createParameter(params: Partial<CertificateField>): Observable<CertificateField> {

    return this._http.post<CertificateField>(
      `${this._API_URL}/api/certificate/parameter`,
      params
    ).pipe(
      tap(response => {
        console.log('Respuesta del servidor:', response);
        if (response && response.id) {
          this.getParameters();
        }
      }),
    );
  }

}
