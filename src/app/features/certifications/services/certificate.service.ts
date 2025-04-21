import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  constructor(private _http: HttpClient) {}

  getCertificateList(): Observable<Certificate[]> {
    return this._http.get<Certificate[]>(
      `${environment.dataUrl}/certificates.json`,
    );
  }

  getCertificateById(id: string): Observable<Certificate | undefined> {
    return this._http
      .get<Certificate[]>(`${environment.dataUrl}/certificates.json`)
      .pipe(
        map((certificates) =>
          certificates.find((certificate) => certificate.id === id),
        ),
      );
  }
}
