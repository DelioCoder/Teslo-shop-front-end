import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthResponse } from '@auth/interface/auth.interface';
import { User } from '@auth/interface/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {

    private router = inject(Router);

    private _authStatus = signal<AuthStatus>(localStorage.getItem('token') ? 'checking' : 'not-authenticated');

    private _user = signal<User | null>(null);
    private _token = signal<string | null>(localStorage.getItem('token'));

    private http = inject(HttpClient);

    checkStatusResource = rxResource({
        loader: () => this.checkStatus()
    });

    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';

        if (this._user()) {
            return 'authenticated'
        }

        return 'not-authenticated';
    });

    user = computed<User | null>(() => this._user());
    token = computed<string | null>(() => this._token());
    isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
            email,
            password
        }).pipe(
            map(resp => this.handleAuthSuccess(resp)),
            catchError((error: any) => this.handleAuthError(error))
        )
    }

    register(fullName: string, email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
            fullName,
            email,
            password
        }).pipe(
            tap(resp => console.log(resp)),
            map(resp => this.handleAuthSuccess(resp)),
            catchError((error:any) => this.handleAuthError(error))
        )
    }

    checkStatus(): Observable<boolean> {
        const token = localStorage.getItem('token');

        if (!token) {
            this._authStatus.set('not-authenticated');
            return of(false)
        }

        return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
            tap(resp => this.handleAuthSuccess(resp)),
            map(() => true),
            catchError((error: any) => this.handleAuthError(error))
        )
    }

    logout() {
        this._user.set(null);
        this._authStatus.set('not-authenticated');
        this._token.set(null);

        localStorage.removeItem('token');
    }

    private handleAuthSuccess({ token, user }: AuthResponse) {
        this._user.set(user);
        this._authStatus.set('authenticated');
        this._token.set(token);

        localStorage.setItem('token', token);

        return true;
    }

    private handleAuthError(error: any) {
        this.logout();
        this._authStatus.set('not-authenticated');
        return of(false);
    }

}