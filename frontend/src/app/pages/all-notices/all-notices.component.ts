import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-all-notices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="all-notices-page">
      <div class="page-header bg-warning">
        <div class="container">
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1>All Notices</h1>
          <p>Important announcements and circulars</p>
        </div>
      </div>

      <div class="container">
        <div *ngIf="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading notices...</p>
        </div>

        <div *ngIf="!isLoading && noticesList.length === 0" class="no-data">
          <p>No notices available at the moment.</p>
        </div>

        <div *ngIf="!isLoading && noticesList.length > 0" class="notices-list">
          <div *ngFor="let notice of noticesList" class="notice-card">
            <div class="notice-header">
              <div class="notice-title-section">
                <h3 style="cursor: pointer;">{{ notice.title }}</h3>
                <div class="notice-meta">
                  <span class="date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {{ notice.createdDate | date:'MMM d, y' }}
                  </span>
                  <span class="author">By {{ notice.createdBy }}</span>
                  <span class="priority-badge" [class.high]="notice.priority >= 7" [class.medium]="notice.priority >= 4 && notice.priority < 7">
                    Priority: {{ notice.priority }}
                  </span>
                </div>
              </div>
              <a *ngIf="notice.attachmentUrl" [href]="notice.attachmentUrl" target="_blank" class="attachment-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
                View Attachment
              </a>
            </div>
            <p class="notice-content">{{ notice.content }}</p>
            <div class="notice-footer" *ngIf="notice.expiryDate">
              <span class="expiry">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Expires: {{ notice.expiryDate | date:'MMM d, y' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .all-notices-page {
      min-height: 100vh;
      background-color: #f9fafb;
    }

    .page-header {
      // background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 3rem 0;
    }

    .container {
      max-width: 1000px;
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
      border-top-color: #f5576c;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .notices-list {
      padding: 3rem 0;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .notice-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #f5576c;
      transition: all 0.3s;
    }

    .notice-card:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      transform: translateX(4px);
    }

    .notice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .notice-title-section {
      flex: 1;
    }

    .notice-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.75rem 0;
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
      color: #f5576c;
    }

    .download-icon {
      flex-shrink: 0;
      opacity: 0.6;
      transition: all 0.2s;
    }

    .title-link:hover .download-icon {
      opacity: 1;
      color: #f5576c;
      transform: translateY(2px);
    }

    .notice-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }

    .date, .author {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .priority-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: #e5e7eb;
      color: #4b5563;
    }

    .priority-badge.medium {
      background: #fef3c7;
      color: #92400e;
    }

    .priority-badge.high {
      background: #fee2e2;
      color: #991b1b;
    }

    .attachment-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #eff6ff;
      color: #1e40af;
      padding: 0.625rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .attachment-btn:hover {
      background: #dbeafe;
      transform: translateY(-2px);
    }

    .notice-content {
      color: #374151;
      font-size: 1rem;
      line-height: 1.7;
      margin: 0;
    }

    .notice-footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .expiry {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      color: #ef4444;
      font-size: 0.875rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .notice-header {
        flex-direction: column;
      }

      .attachment-btn {
        align-self: flex-start;
      }
    }
  `]
})
export class AllNoticesComponent implements OnInit {
  noticesList: any[] = [];
  isLoading = false;

  constructor(
    private announcementService: AnnouncementService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadNotices();
  }

  loadNotices(): void {
    this.isLoading = true;
    this.announcementService.getAll().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.noticesList = data.filter((notice: any) => notice.isActive);
        } else {
          console.error('Expected array for notices but got:', data);
          this.noticesList = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading notices:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
