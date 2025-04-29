import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Template } from '@shared/models/interfaces/template.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private _API_URL: string = environment.API_URL;
  private _template: BehaviorSubject<Template[]> = new BehaviorSubject<Template[]>([]);

  constructor(private _http: HttpClient) {}

  getTemplates(): Observable<Template[]> {
    return this._http.get<Template[]>(`${this._API_URL}/api/certificate/template`)
      .pipe(
        tap((templates: Template[] )=> this._template.next(templates))
      )
  }

  removeTemplate(id: number): Observable<Template> {
    return this._http.delete<Template>(`${this._API_URL}/api/certificate/template/${id}`)
      .pipe(
        tap((template: Template) => {
          if (template && template.id) {
            this.getTemplates();
          }
        }),
      );
  }
}
