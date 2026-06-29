import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Page {
    id?: number;
    title: string;
    slug: string;
    content: string;
    sidebarContent?: string;
    layoutType?: string;
    backgroundImageUrl?: string;
    backgroundColor?: string;
    metaDescription?: string;
    isPublished: boolean;
    createdDate?: Date;
    updatedDate?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class PageService {
    private apiUrl = `${environment.apiUrl}/api/pages`;

    constructor(private http: HttpClient) { }

    getPages(): Observable<Page[]> {
        return this.http.get<Page[]>(this.apiUrl);
    }

    getPage(id: number): Observable<Page> {
        return this.http.get<Page>(`${this.apiUrl}/${id}`);
    }

    getPageBySlug(slug: string): Observable<Page> {
        return this.http.get<Page>(`${this.apiUrl}/slug/${slug}`);
    }

    createPage(page: Page): Observable<Page> {
        return this.http.post<Page>(this.apiUrl, page);
    }

    updatePage(id: number, page: Page): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, page);
    }

    deletePage(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
