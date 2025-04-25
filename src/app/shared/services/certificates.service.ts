import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CertificateType, CertificateField } from '@shared/models/interfaces/certificate.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificatesService {
  private readonly _API_URL: string = environment.API_URL;
  private _certificateTypes: BehaviorSubject<CertificateType[]> = new BehaviorSubject<CertificateType[]>([]);

  certificateType: Observable<CertificateType[]> = this._certificateTypes.asObservable();

  constructor(private http: HttpClient) {
    this.getCertificateTypes();
  }

  getCertificateTypes(): void {
    this.http.get<CertificateType[]>(`${this._API_URL}/api/certificate/type`)
      .pipe(
        tap(types => this._certificateTypes.next(types))
      )
      .subscribe({
        error: (error) => console.error('Error loading certificate types:', error)
      });
  }

  // Obtener todos los parámetros disponibles
  getAllParameters(): Observable<CertificateField[]> {
    return this.http.get<CertificateField[]>(`${this._API_URL}/api/certificate/parameter`);
  }

  // Obtener parámetros por tipo de certificado
  getCertificateParametersByType(certificateTypeId: number): Observable<CertificateField[]> {
    return this.http.get<CertificateField[]>(`${this._API_URL}/api/certificate/parameter?id=${certificateTypeId}`);
  }

  // Asignar parámetros a un tipo de certificado
  assignParametersToCertificate(certificateTypeId: number, parameters: CertificateField[]): Observable<any> {
    return this.http.post(`${this._API_URL}/api/certificate/${certificateTypeId}/parameters`, parameters);
  }

  // Desasignar parámetros de un tipo de certificado
  unassignParametersFromCertificate(certificateTypeId: number, parameters: CertificateField[]): Observable<any> {
    // Asumiendo que el backend acepta un array de IDs de parámetros para desasignar
    const parameterIds = parameters.map(p => p.id);
    return this.http.delete(`${this._API_URL}/api/certificate/${certificateTypeId}/parameters`, { body: parameterIds });
  }

  createCertificateType(certificate: Partial<CertificateType>): Observable<CertificateType> {
    return this.http.post<CertificateType>(`${this._API_URL}/api/certificate/type`, certificate);
  }
}
