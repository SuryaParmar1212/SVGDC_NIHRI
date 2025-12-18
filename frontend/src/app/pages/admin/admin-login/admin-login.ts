import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AdminService, LoginCredentials, Admin } from '../../../services/admin.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-login.html',
    styleUrls: ['./admin-login.css']
})
export class AdminLogin {
    credentials: LoginCredentials = {
        username: '',
        password: ''
    };

    errorMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private adminService: AdminService,
        private router: Router
    ) {
        // Redirect if already logged in
        if (this.adminService.isAuthenticated()) {
            this.router.navigate(['/admin/dashboard']);
        }
    }

    onSubmit(): void {
        if (!this.credentials.username || !this.credentials.password) {
            this.errorMessage = 'Please enter both username and password';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.adminService.login(this.credentials)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (admin: Admin) => {
                    this.router.navigate(['/admin/dashboard']);
                },
                error: (error: any) => {
                    this.errorMessage = error.error?.message || 'Invalid username or password';
                    console.error('Login error:', error);
                }
            });
    }
}

