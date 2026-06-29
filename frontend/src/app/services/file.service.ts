import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private apiUrl = environment.apiUrl + '/api/Files'; // Centralized file upload controller

    constructor(private http: HttpClient, private adminService: AdminService) { }

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        // Manually construct headers to avoid 'Content-Type': 'application/json'
        // Browser will auto-set 'Content-Type': 'multipart/form-data; boundary=...'
        let headers = new HttpHeaders();
        const token = this.adminService.currentAdminValue?.token;
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return this.http.post<any>(`${this.apiUrl}/Upload`, formData, { headers });
    }
}
