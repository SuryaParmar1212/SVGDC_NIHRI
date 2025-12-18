import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { ToastComponent } from './components/toast/toast.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, ToastComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isAdminRoute = signal(false);

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const checkRoute = (url: string) => {
      this.isAdminRoute.set(url.includes('/admin'));
      this.cdr.detectChanges();
    };

    // Initial check
    checkRoute(this.router.url);
    if (typeof window !== 'undefined') {
      checkRoute(window.location.pathname);
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      checkRoute(event.urlAfterRedirects || event.url);
    });
  }
}
