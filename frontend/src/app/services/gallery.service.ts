import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { environment } from '../../environments/environment';

export interface GalleryItem {
    id?: number;
    title: string;
    type: 'image' | 'video' | 'pdf'; // Type of content
    url: string; // URL to the image, video link, or pdf
    thumbnailUrl?: string; // Optional thumbnail for videos/pdfs
    description?: string; // Optional description
    uploadedDate?: Date;
    isActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class GalleryService {
    private apiUrl = environment.apiUrl + '/api/Gallery'; // Adjust API URL as needed

    constructor(
        private http: HttpClient,
        private adminService: AdminService
    ) { }

    getAll(): Observable<GalleryItem[]> {
        return this.http.get<GalleryItem[]>(this.apiUrl);
    }

    getById(id: number): Observable<GalleryItem> {
        return this.http.get<GalleryItem>(`${this.apiUrl}/${id}`);
    }

    create(item: GalleryItem): Observable<GalleryItem> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.post<GalleryItem>(this.apiUrl, item, { headers });
    }

    update(id: number, item: GalleryItem): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, item, { headers: this.adminService.getAuthHeaders() });
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.adminService.getAuthHeaders() });
    }

    uploadImage(file: File): Observable<any> {
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
