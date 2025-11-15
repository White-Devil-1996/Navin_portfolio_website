import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private ACCESS = 'access_token';
  private REFRESH = 'refresh_token';

  private _loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._loggedIn.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        if (this.isBrowser()) {
          localStorage.setItem(this.ACCESS, res.access_token);
          localStorage.setItem(this.REFRESH, res.refresh_token);
        }
        this._loggedIn.next(true);
      })
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.ACCESS);
      localStorage.removeItem(this.REFRESH);
    }
    this._loggedIn.next(false);
  }

  getAccessToken() {
    if (this.isBrowser()) {
      return localStorage.getItem(this.ACCESS);
    }
    return null;
  }

  getRefreshToken() {
    if (this.isBrowser()) {
      return localStorage.getItem(this.REFRESH);
    }
    return null;
  }

  refreshToken() {
    return this.http.post(`${environment.apiUrl}/auth/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap((res: any) => {
        if (this.isBrowser()) {
          localStorage.setItem(this.ACCESS, res.accessToken);
          localStorage.setItem(this.REFRESH, res.refreshToken);
        }
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  private hasToken() {
    if (this.isBrowser()) {
      return !!localStorage.getItem(this.ACCESS);
    }
    return false;
  }
}
