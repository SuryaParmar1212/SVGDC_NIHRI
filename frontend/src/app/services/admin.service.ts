import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Admin {
    id: number;
    username: string;
    email: string;
    fullName: string;
    token: string;
    role: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl + '/api/AdminAuth';
    private currentAdminSubject: BehaviorSubject<Admin | null>;
    public currentAdmin: Observable<Admin | null>;

    constructor(private http: HttpClient) {
        const storedAdmin = localStorage.getItem('currentAdmin');
        this.currentAdminSubject = new BehaviorSubject<Admin | null>(
            storedAdmin ? JSON.parse(storedAdmin) : null
        );
        this.currentAdmin = this.currentAdminSubject.asObservable();
    }

    public get currentAdminValue(): Admin | null {
        return this.currentAdminSubject.value;
    }

    login(credentials: LoginCredentials): Observable<Admin> {
        return this.http.post<Admin>(`${this.apiUrl}/login`, credentials)
            .pipe(
                tap(admin => {
                    localStorage.setItem('currentAdmin', JSON.stringify(admin));
                    this.currentAdminSubject.next(admin);
                })
            );
    }

    logout(): void {
        localStorage.removeItem('currentAdmin');
        this.currentAdminSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.currentAdminValue;
    }

    getAuthHeaders(): HttpHeaders {
        const admin = this.currentAdminValue;
        // Check for token in both camelCase and PascalCase
        const token = admin?.token || (admin as any)?.Token;

        if (token) {
            return new HttpHeaders({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            });
        }
        return new HttpHeaders({
            'Content-Type': 'application/json'
        });
    }
}
