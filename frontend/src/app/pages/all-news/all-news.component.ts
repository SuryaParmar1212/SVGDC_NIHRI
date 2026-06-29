import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NewsService, News } from '../../services/news.service';

@Component({
  selector: 'app-all-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="all-news-page">
      <div class="page-header bg-primary">
        <div class="container">
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1>All News</h1>
          <p>Latest updates and announcements from our institution</p>
        </div>
      </div>

      <div class="container">
        <div *ngIf="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading news...</p>
        </div>

        <div *ngIf="!isLoading && newsList.length === 0" class="no-data">
          <p>No news available at the moment.</p>
        </div>

        <div *ngIf="!isLoading && newsList.length > 0" class="news-grid">
          <div *ngFor="let news of newsList" class="news-card">
            <div class="news-image" *ngIf="news.imageUrl">
              <img [src]="news.imageUrl" [alt]="news.title">
            </div>
            <div class="news-content">
              <div class="news-meta">
                <span class="category">{{ news.category }}</span>
                <span class="date">{{ news.publishedDate | date:'MMM d, y' }}</span>
              </div>
              <h3>{{ news.title }}</h3>
              <p class="news-excerpt">{{ news.content }}</p>
              <div class="news-footer">
                <span class="author">By {{ news.author }}</span>
                <a *ngIf="news.pdfUrl" [href]="news.pdfUrl" target="_blank" class="pdf-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  View PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .all-news-page {
      min-height: 100vh;
      background-color: #f9fafb;
    }

    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      transition: background 0.2s;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .page-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }

    .page-header p {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    .loading, .no-data {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .news-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      padding: 3rem 0;
    }

    .news-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
    }

    .news-card:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      transform: translateY(-4px);
    }

    .news-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }

    .news-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .news-card:hover .news-image img {
      transform: scale(1.05);
    }

    .news-content {
      padding: 1.5rem;
    }

    .news-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .category {
      background: #eef2ff;
      color: #4f46e5;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .date {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .news-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
    }

    .title-link {
      color: #111827;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s;
      cursor: pointer;
    }

    .title-link:hover {
      color: #4f46e5;
    }

    .download-icon {
      flex-shrink: 0;
      opacity: 0.6;
      transition: all 0.2s;
    }

    .title-link:hover .download-icon {
      opacity: 1;
      color: #4f46e5;
      transform: translateY(2px);
    }

    .news-excerpt {
      color: #4b5563;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .news-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .author {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .pdf-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #ef4444;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }

    .pdf-link:hover {
      color: #dc2626;
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .news-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `]
})
export class AllNewsComponent implements OnInit {
  newsList: News[] = [];
  isLoading = false;

  constructor(
    private newsService: NewsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.isLoading = true;
    this.newsService.getAll().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.newsList = data.filter((news: News) => news.isActive);
        } else {
          this.newsList = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
