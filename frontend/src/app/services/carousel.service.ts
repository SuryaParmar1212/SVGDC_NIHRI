import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { environment } from '../../environments/environment.prod';

export interface CarouselItem {
    id?: number;
    imageUrl: string;
    title?: string;
    sortOrder: number;
    isActive: boolean;
    uploadSource?: 'url' | 'file';
    selectedFile?: File;
}

@Injectable({
    providedIn: 'root'
})
export class CarouselService {
    private apiUrl = environment.apiUrl + '/api/Carousel';

    constructor(
        private http: HttpClient,
        private adminService: AdminService
    ) { }

    getAll(): Observable<CarouselItem[]> {
        return this.http.get<CarouselItem[]>(this.apiUrl);
    }

    getActive(): Observable<CarouselItem[]> {
        return this.http.get<CarouselItem[]>(`${this.apiUrl}/Active`);
    }

    create(item: CarouselItem): Observable<CarouselItem> {
        return this.http.post<CarouselItem>(this.apiUrl, item, { headers: this.adminService.getAuthHeaders() });
    }

    update(id: number, item: CarouselItem): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, item, { headers: this.adminService.getAuthHeaders() });
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.adminService.getAuthHeaders() });
    }
}
