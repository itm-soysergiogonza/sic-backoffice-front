import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificatesService {
  private readonly _API_URL: string = environment.API_URL;
  private _certificateTypes: BehaviorSubject<CertificateType[]> = new BehaviorSubject<CertificateType[]>([]);

  certificateType: Observable<CertificateType[]> = this._certificateTypes.asObservable();

  constructor(private http: HttpClient) {
    this.loadCertificateTypes();
  }

  loadCertificateTypes(): void {
    this.http.get<CertificateType[]>(`${this._API_URL}/api/certificate/type`)
      .pipe(
        tap(types => this._certificateTypes.next(types))
      )
      .subscribe({
        error: (error) => console.error('Error loading certificate types:', error)
      });
  }
}
