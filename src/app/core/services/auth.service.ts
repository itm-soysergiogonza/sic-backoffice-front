import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_user';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null,
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public setUserFromMicroFrontend(userData: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  public logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  public loginWithFakeData(): void {
    const fakeUser: User = {
      id: '1',
      email: 'johnconnor@itm.edu.co',
      name: 'John Connor',
      role: 'admin',
      token: 'fake-jwt-token',
    };
    this.setUserFromMicroFrontend(fakeUser);
  }
}
