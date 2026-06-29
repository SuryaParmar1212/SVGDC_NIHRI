import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { environment } from '../../environments/environment';

// export interface Announcement {
//     id?: number;
//     title: string;
//     content: string;
//     createdDate?: Date;
//     expiryDate?: Date;
//     isActive?: boolean;
//     priority?: number;
//     createdBy: string;
//     attachmentUrl?: string;
// }

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService {
    private apiUrl = environment.apiUrl + '/api/Announcements';

    constructor(
        private http: HttpClient,
        private adminService: AdminService
    ) { }

    getAll(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    create(announcement: any): Observable<any> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.post<any>(this.apiUrl, announcement, { headers });
    }

    update(id: number, announcement: any): Observable<any> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.put(`${this.apiUrl}/${id}`, announcement, { headers });
    }

    delete(id: number): Observable<any> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }
}
