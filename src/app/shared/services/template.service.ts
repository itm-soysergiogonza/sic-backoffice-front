import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Template } from '@shared/models/interfaces/template.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private _API_URL: string = environment.API_URL;
  private _template: BehaviorSubject<Template[]> = new BehaviorSubject<
    Template[]
  >([]);

  constructor(private _http: HttpClient) {}

  createTemplate(params: Partial<Template>): Observable<Template> {
    return this._http.post<Template>(
      `${this._API_URL}/api/certificate/template`,
      params
    );
  }

  getTemplates(): Observable<Template[]> {
    return this._http
      .get<Template[]>(`${this._API_URL}/api/certificate/template`)
      .pipe(tap((templates: Template[]) => this._template.next(templates)));
  }

  getTemplatesByCertificateType(
    certificateTypeId: number
  ): Observable<Template[]> {
    return this._http
      .get<Template[]>(
        `${this._API_URL}/api/certificate/template/certificate-type/` +
          certificateTypeId
      )
      .pipe(tap((templates: Template[]) => this._template.next(templates)));
  }

  updateTemplate(id: number, params: Partial<Template>): Observable<Template> {
    return this._http.put<Template>(
      `${this._API_URL}/api/certificate/template/${id}`,
      params
    );
  }

  removeTemplate(id: number): Observable<Template> {
    return this._http.delete<Template>(
      `${this._API_URL}/api/certificate/template/${id}`
    );
  }
}
