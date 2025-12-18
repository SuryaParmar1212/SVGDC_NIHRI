import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { PageService, Page } from '../../services/page.service';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dynamic-page-root">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-overlay">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="container py-5 text-center">
        <div class="card shadow-sm p-5 border-0 rounded-4">
          <i class="bi bi-exclamation-triangle display-1 text-danger mb-4"></i>
          <h2 class="fw-bold">{{ error }}</h2>
          <p class="text-muted">The page you are looking for might have been moved or deleted.</p>
          <a routerLink="/" class="btn btn-primary rounded-pill px-4 mt-3">Back to Home</a>
        </div>
      </div>

      <div class="page-container animate-in" *ngIf="page && !loading">
        <!-- Hero Section -->
        <div class="hero-section" [style.backgroundImage]="'url(' + (page.backgroundImageUrl || 'assets/images/college-bg.jpg') + ')'">
          <div class="hero-overlay"></div>
          <div class="container h-100">
            <div class="row h-100 align-items-center">
              <div class="col-12 text-center text-white">
                <h1 class="display-3 fw-bold">{{ page.title }}</h1>
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb justify-content-center">
                    <li class="breadcrumb-item"><a routerLink="/" class="text-white">Home</a></li>
                    <li class="breadcrumb-item active text-white opacity-75" aria-current="page">{{ page.title }}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Layout Switcher -->
        <div [ngSwitch]="page.layoutType">
          
          <!-- SIDEBAR LAYOUT -->
          <div *ngSwitchCase="'Sidebar'" class="content-section py-5 bg-light">
            <div class="container">
               <div class="row">
                  <div class="col-lg-8">
                     <div class="card shadow-sm border-0 mb-4 content-card">
                        <div class="card-body p-4 p-md-5">
                           <div class="dynamic-content-area" [innerHTML]="page.content"></div>
                        </div>
                     </div>
                  </div>
                  <div class="col-lg-4">
                     <div class="sidebar sticky-top" style="top: 100px;">
                        <div class="card shadow-sm border-0 mb-4 bg-primary text-white">
                           <div class="card-body p-4">
                              <h5 class="fw-bold mb-3">Quick Navigation</h5>
                              <div class="sidebar-inner" [innerHTML]="page.sidebarContent"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <!-- STANDARD / FULL WIDTH LAYOUT -->
          <div *ngSwitchDefault class="content-section py-5 bg-white">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-lg-10">
                  <div class="card shadow-sm border-0 content-card">
                    <div class="card-body p-4 p-md-5">
                        <div class="dynamic-content-area" [innerHTML]="page.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay { height: 60vh; display: flex; align-items: center; justify-content: center; background: #fff; }
    .hero-section {
      height: 400px;
      background-size: cover;
      background-position: center;
      position: relative;
      background-attachment: fixed;
      background-color: #002147; /* Fallback for missing images */
    }
    .hero-overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to bottom, rgba(0,33,71,0.8), rgba(0,33,71,0.4));
    }
    .content-card { border-radius: 20px; background: #ffffff !important; overflow: hidden; }
    .dynamic-content-area {
      line-height: 1.8;
      font-size: 1.15rem;
      color: #334155;
    }
    ::ng-deep .dynamic-content-area h1, ::ng-deep .dynamic-content-area h2 {
      color: #002147; font-weight: 800; margin: 2rem 0 1rem;
    }
    ::ng-deep .dynamic-content-area p { margin-bottom: 1.5rem; }
    .animate-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DynamicPageComponent implements OnInit {
  page: Page | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Handle routes like /page/:slug
      const slug = params['slug'];
      if (slug) {
        this.loadPage(slug);
      } else {
        // Handle generic wildcard matching if configured differently
        const url = this.router.url.substring(1); // remove leading slash
        this.loadPage(url);
      }
    });
  }

  loadPage(slug: string): void {
    this.loading = true;
    this.error = '';

    this.pageService.getPageBySlug(slug).subscribe({
      next: (data) => {
        this.page = data;
        this.loading = false;

        // Update Meta Tags
        this.titleService.setTitle(`${this.page.title} - Government College Nihri`);
        if (this.page.metaDescription) {
          this.metaService.updateTag({ name: 'description', content: this.page.metaDescription });
        }

        this.cdr.detectChanges();
        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('Failed to load page', err);
        this.error = 'Page not found';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
