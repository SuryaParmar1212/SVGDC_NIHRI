import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { environment } from '../../environments/environment';

export interface News {
    id?: number;
    title: string;
    content: string;
    imageUrl?: string;
    publishedDate?: Date;
    isActive?: boolean;
    author: string;
    category: string;
    pdfUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private apiUrl = environment.apiUrl + '/api/News';

    constructor(
        private http: HttpClient,
        private adminService: AdminService
    ) { }

    getAll(): Observable<News[]> {
        return this.http.get<News[]>(this.apiUrl);
    }

    getById(id: number): Observable<News> {
        return this.http.get<News>(`${this.apiUrl}/${id}`);
    }

    getByCategory(category: string): Observable<News[]> {
        return this.http.get<News[]>(`${this.apiUrl}/category/${category}`);
    }

    create(news: News): Observable<News> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.post<News>(this.apiUrl, news, { headers });
    }

    update(id: number, news: News): Observable<any> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.put(`${this.apiUrl}/${id}`, news, { headers });
    }

    delete(id: number): Observable<any> {
        const headers = this.adminService.getAuthHeaders();
        return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }
}
