import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Variable } from '@shared/models/interfaces/variables.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  private readonly _API_URL: string = environment.API_URL;
  private _variables: BehaviorSubject<Variable[]> = new BehaviorSubject<
    Variable[]
  >([]);

  constructor(private _http: HttpClient) {}

  createVariable(data: Partial<Variable>): Observable<Variable> {
    return this._http.post<Variable>(
      `${this._API_URL}/api/certificate/variable`,
      data
    );
  }

  getVariablesByCertificateType(
    certificateTypeId: number
  ): Observable<Variable[]> {
    return this._http
      .get<Variable[]>(
        `${this._API_URL}/api/certificate/variable/certificate-type/` +
          certificateTypeId
      )
      .pipe(tap((variables) => this._variables.next(variables)));
  }

  getVariables(): Observable<Variable[]> {
    return this._http
      .get<Variable[]>(`${this._API_URL}/api/certificate/variable`)
      .pipe(tap((variables) => this._variables.next(variables)));
  }

  getVariableById(id: number): Observable<Variable> {
    return this._http.get<Variable>(`${this._API_URL}/api/certificate/variable/${id}`);
  }

  updateVariable(id: number, params: Partial<Variable>): Observable<Variable> {
    return this._http.put<Variable>(
      `${this._API_URL}/api/certificate/variable/${id}`,
      params
    );
  }

  removeVariable(id: number): Observable<Variable> {
    return this._http.delete<Variable>(
      `${this._API_URL}/api/certificate/variable/${id}`
    );
  }
}
