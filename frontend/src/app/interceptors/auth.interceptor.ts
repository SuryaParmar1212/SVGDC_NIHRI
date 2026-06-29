import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const adminService = inject(AdminService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.error('Session expired. Please login again.');
        adminService.logout();
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};
