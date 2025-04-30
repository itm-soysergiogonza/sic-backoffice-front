import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {
  CertificateType,
  CertificateField,
} from '@shared/models/interfaces/certificate.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificatesService {
  private readonly _API_URL: string = environment.API_URL;
  private _certificateTypes: BehaviorSubject<CertificateType[]> =
    new BehaviorSubject<CertificateType[]>([]);

  certificateType: Observable<CertificateType[]> =
    this._certificateTypes.asObservable();

  constructor(private http: HttpClient) {
    this.getCertificateTypes();
  }

  getCertificateTypes(): void {
    this.http
      .get<CertificateType[]>(`${this._API_URL}/api/certificate/type`)
      .pipe(tap((types) => this._certificateTypes.next(types)))
      .subscribe({
        error: (error) =>
          console.error('Error loading certificate types:', error),
      });
  }

  getAllParameters(): Observable<CertificateField[]> {
    return this.http.get<CertificateField[]>(
      `${this._API_URL}/api/certificate/parameter`
    );
  }

  getCertificateParametersByType(
    certificateTypeId: number
  ): Observable<CertificateField[]> {
    return this.http.get<CertificateField[]>(
      `${this._API_URL}/api/certificate/parameter?id=${certificateTypeId}`
    );
  }

  assignParametersToCertificate(
    certificateTypeId: number,
    parameters: CertificateField[]
  ): Observable<any> {
    return this.http.post(
      `${this._API_URL}/api/certificate/${certificateTypeId}/parameters`,
      parameters
    );
  }

  deleteCertificateType(certificateTypeId: number): Observable<any> {
    return this.http.delete(
      `${this._API_URL}/api/certificate/type/${certificateTypeId}`
    );
  }

  createCertificateType(
    certificate: Partial<CertificateType>
  ): Observable<CertificateType> {
    return this.http.post<CertificateType>(
      `${this._API_URL}/api/certificate/type`,
      certificate
    );
  }

  updateCertificateType(
    id: any,
    certificate: Partial<CertificateType>
  ): Observable<CertificateType> {
    return this.http.put<CertificateType>(
      `${this._API_URL}/api/certificate/type/` + id,
      certificate
    );
  }
}
