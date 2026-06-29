import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { environment } from '../../environments/environment';

export interface Notice {
    id?: number;
    title: string;
    content: string;
    attachmentUrl?: string;
    publishedDate?: Date;
    expiryDate?: Date;
    isActive?: boolean;
    category?: string;
    priority?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NoticeService {
    private apiUrl = environment.apiUrl + '/api/Notices';

    constructor(
        private http: HttpClient,
        private adminService: AdminService
    ) { }

    getAll(): Observable<Notice[]> {
        return this.http.get<Notice[]>(this.apiUrl);
    }

    getById(id: number): Observable<Notice> {
        return this.http.get<Notice>(`${this.apiUrl}/${id}`);
    }

    create(notice: Notice): Observable<Notice> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.post<Notice>(this.apiUrl, notice, { headers });
    }

    update(id: number, notice: Notice): Observable<any> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.put(`${this.apiUrl}/${id}`, notice, { headers });
    }

    delete(id: number): Observable<any> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }
}
