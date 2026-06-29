import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Departments } from './pages/departments/departments';
import { Admissions } from './pages/admissions/admissions';
import { AdminLogin } from './pages/admin/admin-login/admin-login';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { AllNewsComponent } from './pages/all-news/all-news.component';
import { AllNoticesComponent } from './pages/all-notices/all-notices.component';
import { NSSComponent } from './pages/nss/nss.component';
import { PrincipalMessageComponent } from './pages/principal-message/principal-message';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'about', component: About },
    { path: 'departments', component: Departments },
    { path: 'admissions', component: Admissions },
    { path: 'admin/login', component: AdminLogin },
    { path: 'admin/dashboard', component: AdminDashboard },
    { path: 'all-news', component: AllNewsComponent },
    { path: 'all-notices', component: AllNoticesComponent },
    { path: 'gallery', loadComponent: () => import('./pages/all-gallery/all-gallery.component').then(m => m.AllGalleryComponent) },
    { path: 'nss', component: NSSComponent },
    { path: 'ncc', component: NSSComponent }, // Using same component for NCC
    { path: 'principal-message', component: PrincipalMessageComponent },
    { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactUsComponent) },
    { path: ':slug', loadComponent: () => import('./pages/dynamic-page/dynamic-page.component').then(m => m.DynamicPageComponent) },
    { path: '**', redirectTo: '' }
];
