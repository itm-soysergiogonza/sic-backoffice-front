import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';

export interface Template {
  id: number;
  name: string;
  content: string;
  certificateType: CertificateType;
}

export interface CreateTemplateDTO {
  certificateTypeId: number;
  name: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private _API_URL: string = environment.API_URL;

  constructor(private _http: HttpClient) { }

  getTemplateById(id: number): Observable<Template> {
    return this._http.get<Template>(`${this._API_URL}/api/certificate/template/${id}`);
  }

  saveTemplate(template: CreateTemplateDTO): Observable<Template> {
    return this._http.post<Template>(`${this._API_URL}/api/certificate/template`, template);
  }
}
