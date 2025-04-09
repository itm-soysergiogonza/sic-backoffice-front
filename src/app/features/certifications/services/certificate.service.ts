import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private mockCertificates: Certificate[] = [
    {
      id: '1',
      name: 'Certificado de Notas',
      category: 'Académico',
      purpose: 'Certificar las calificaciones del estudiante',
      outputFormat: 'PDF',
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  constructor(private http: HttpClient) {}

  getCertificates(): Observable<Certificate[]> {
    return of(this.mockCertificates);
  }

  createCertificate(certificate: Partial<Certificate>): Observable<Certificate> {
    const newCertificate: Certificate = {
      id: (this.mockCertificates.length + 1).toString(),
      name: certificate.name!,
      category: certificate.category!,
      purpose: certificate.purpose!,
      outputFormat: certificate.outputFormat!,
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockCertificates.push(newCertificate);
    return of(newCertificate);
  }

  getCertificateById(id: string): Observable<Certificate | undefined> {
    return of(this.mockCertificates.find(cert => cert.id === id));
  }
}
