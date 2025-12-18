import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NavigationItem {
    id?: number;
    title: string;
    icon?: string;
    link?: string;
    parentId?: number | null;
    parent?: NavigationItem;
    children?: NavigationItem[];
    order: number;
    isActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private apiUrl = `${environment.apiUrl}/api/navigation`;

    constructor(private http: HttpClient) { }

    getNavigationItems(): Observable<NavigationItem[]> {
        return this.http.get<NavigationItem[]>(this.apiUrl);
    }

    getNavigationTree(): Observable<NavigationItem[]> {
        return this.http.get<NavigationItem[]>(`${this.apiUrl}/tree`);
    }

    getNavigationItem(id: number): Observable<NavigationItem> {
        return this.http.get<NavigationItem>(`${this.apiUrl}/${id}`);
    }

    createNavigationItem(item: NavigationItem): Observable<NavigationItem> {
        return this.http.post<NavigationItem>(this.apiUrl, item);
    }

    updateNavigationItem(id: number, item: NavigationItem): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, item);
    }

    deleteNavigationItem(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
