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
  }

  getParametersByCertificateType(certificateTypeId: number): Observable<CertificateField[]> {
     return this._http.get<CertificateField[]>(
      `${this._API_URL}/api/certificate/parameter/certificate-type/`+certificateTypeId)
       .pipe(
         tap((parameters: CertificateField[]) => {
         this._parameters.next(parameters)
       }))
  }

  createParameter(params: Partial<CertificateField>): Observable<CertificateField> {
    return this._http.post<CertificateField>(
      `${this._API_URL}/api/certificate/parameter`,
      params
    );
  }

  removeParameter(paramId: number): Observable<CertificateField> {
    return this._http.delete<CertificateField>(
      `${this._API_URL}/api/certificate/parameter/${paramId}`
    );
  }

  updateParameter(paramId: number, params: Partial<CertificateField>): Observable<CertificateField> {
    console.log(`Enviando petición PUT a ${this._API_URL}/api/certificate/parameter/${paramId}`);
    console.log('Datos de la petición:', params);
    
    return this._http.put<CertificateField>(
      `${this._API_URL}/api/certificate/parameter/${paramId}`,
      params
    ).pipe(
      tap({
        error: (error) => {
          console.error('Error en la petición PUT:', error);
        }
      }),
    );
  }
}
