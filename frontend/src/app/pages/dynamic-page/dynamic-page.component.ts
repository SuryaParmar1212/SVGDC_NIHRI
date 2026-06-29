import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
        <div class="hero-section" [style.backgroundImage]="page.backgroundImageUrl ? 'url(' + page.backgroundImageUrl + ')' : ''" [style.backgroundColor]="page.backgroundColor || '#002147'">
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
                           <div class="dynamic-content-area" [innerHTML]="trustedContent"></div>
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
                        <div class="dynamic-content-area" [innerHTML]="trustedContent"></div>
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
      background-color: #002147; /* Fallback */
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

    ::ng-deep .dynamic-content-area img {
      width: 100%;
      height: auto;
      border-radius: 15px;
      margin: 2rem 0;
      display: block;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    ::ng-deep .dynamic-content-area a {
      color: #0d6efd;
      text-decoration: underline;
      font-weight: 600;
      transition: color 0.2s;
    }

    ::ng-deep .dynamic-content-area a:hover {
      color: #0044cc;
    }

    /* Layout Blocks Support */
    ::ng-deep .side-by-side-row { 
        display: flex; gap: 30px; align-items: center; margin: 30px 0; 
    }
    ::ng-deep .side-image { flex: 1; max-width: 50%; }
    ::ng-deep .side-image img { width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    ::ng-deep .side-content { flex: 1; }
    
    ::ng-deep .underlined-heading { margin: 2rem 0 1.5rem; }
    ::ng-deep .underlined-heading h2 { margin-bottom: 5px; color: #002147; font-weight: 700; }
    ::ng-deep .accent-line { width: 60px; height: 3px; background-color: #ffc107; }

    ::ng-deep .themed-btn { 
        display: inline-block; background: #002147; color: white !important; padding: 12px 30px; border-radius: 6px; 
        text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 10px 0;
        transition: all 0.3s ease;
    }
    ::ng-deep .themed-btn:hover { background: #003366; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,33,71,0.2); }
    
    ::ng-deep .pdf-viewer-card-dynamic {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin: 2rem 0;
    }

    ::ng-deep .pdf-container-embedded {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-bottom: 1.5rem;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
    }

    ::ng-deep .pdf-container-embedded iframe {
        display: block;
        border: none;
    }

    @media (max-width: 768px) {
        ::ng-deep .side-by-side-row { flex-direction: column !important; gap: 20px !important; }
        ::ng-deep .side-image { max-width: 100% !important; order: 1; }
        ::ng-deep .side-content { order: 2; padding: 0 10px; }
        ::ng-deep .pdf-viewer-card-dynamic { padding: 1rem; }
        ::ng-deep .image-gallery-grid { grid-template-columns: 1fr !important; }
    }

    /* Gallery Styles */
    ::ng-deep .image-gallery-grid {
        display: grid; gap: 15px; margin: 2rem 0; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
    ::ng-deep .image-gallery-grid.count-2 { grid-template-columns: 1fr 1fr; }
    ::ng-deep .image-gallery-grid.count-3 { grid-template-columns: 1fr 1fr 1fr; }
    ::ng-deep .image-gallery-grid img { 
        width: 100%; height: 300px; object-fit: cover; border-radius: 15px; 
        transition: 0.3s;
    }
    ::ng-deep .image-gallery-grid img:hover { transform: scale(1.02); }
    
    /* Hide Admin Editor Controls on Public View */
    ::ng-deep .delete-block-btn { display: none !important; }

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
  trustedContent: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
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

        // Sanitize and trust the HTML content
        if (this.page.content) {
          this.trustedContent = this.sanitizer.bypassSecurityTrustHtml(this.page.content);
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
