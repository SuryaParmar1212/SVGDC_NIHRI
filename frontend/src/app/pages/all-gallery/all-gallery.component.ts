import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GalleryService, GalleryItem } from '../../services/gallery.service';

@Component({
  selector: 'app-all-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="all-gallery-page">
      <div class="page-header">
        <div class="container">
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1>Photo Gallery</h1>
          <p>Glimpses of activities and events at our college</p>
        </div>
      </div>

      <div class="container">
        <div *ngIf="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading gallery...</p>
        </div>

        <div *ngIf="!isLoading && galleryList.length === 0" class="no-data">
          <p>No images available at the moment.</p>
        </div>

        <div *ngIf="!isLoading && galleryList.length > 0" class="gallery-grid">
          <div *ngFor="let item of galleryList; let i = index" class="gallery-item" (click)="openLightbox(i)">
            <img [src]="item.type === 'video' ? (item.thumbnailUrl || 'https://via.placeholder.com/300?text=Video') : item.url" 
                 [alt]="item.title" loading="lazy">
            <div class="gallery-overlay">
              <span class="view-icon">
                <svg *ngIf="item.type !== 'video'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="item.type === 'video'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              </span>
              <h5 class="gallery-title">{{ item.title }}</h5>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div class="lightbox" *ngIf="showLightbox" (click)="closeLightbox()">
        <button class="close-btn" (click)="closeLightbox()">&times;</button>
        <button class="nav-btn prev" (click)="prevImage($event)">&#10094;</button>
        <button class="nav-btn next" (click)="nextImage($event)">&#10095;</button>
        
        <div class="lightbox-content" (click)="$event.stopPropagation()">
            <ng-container *ngIf="galleryList[currentIndex].type === 'video'; else imgView">
                 <video controls autoplay [src]="galleryList[currentIndex].url" style="max-width:100%; max-height:80vh; border-radius: 4px;"></video>
            </ng-container>
            <ng-template #imgView>
                 <img *ngIf="galleryList.length > 0" 
                      [src]="galleryList[currentIndex].url" 
                      [alt]="galleryList[currentIndex].title">
            </ng-template>

            <div class="lightbox-caption" *ngIf="galleryList.length > 0">
                <h3>{{ galleryList[currentIndex].title }}</h3>
                <p>{{ currentIndex + 1 }} / {{ galleryList.length }}</p>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .all-gallery-page {
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

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 3rem 0;
    }

    .gallery-item {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 4/3;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .gallery-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px rgba(0,0,0,0.1);
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }

    .gallery-item:hover img {
      transform: scale(1.05);
    }

    .gallery-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .gallery-item:hover .gallery-overlay {
      opacity: 1;
    }

    .view-icon {
      color: white;
      margin-bottom: 0.5rem;
    }

    .gallery-title {
      color: white;
      font-size: 1.1rem;
      text-align: center;
      padding: 0 1rem;
      margin: 0;
    }

    /* Lightbox Styles */
    .lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .lightbox-content {
      max-width: 90%;
      max-height: 90vh;
      position: relative;
    }

    .lightbox-content img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.5);
    }

    .lightbox-caption {
        color: white;
        text-align: center;
        margin-top: 1rem;
    }

    .lightbox-caption h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
    }

    .lightbox-caption p {
        color: #9ca3af;
        margin: 0;
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 30px;
      background: none;
      border: none;
      color: white;
      font-size: 40px;
      cursor: pointer;
      z-index: 10000;
      padding: 0;
      line-height: 1;
    }

    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: none;
      padding: 1rem;
      cursor: pointer;
      font-size: 24px;
      border-radius: 50%;
      transition: background 0.3s;
      z-index: 10000;
    }

    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .prev { left: 20px; }
    .next { right: 20px; }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .gallery-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .nav-btn {
        padding: 0.5rem;
        font-size: 20px;
      }
    }
  `]
})
export class AllGalleryComponent implements OnInit {
  galleryList: GalleryItem[] = [];
  isLoading = false;
  showLightbox = false;
  currentIndex = 0;

  constructor(
    private galleryService: GalleryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadGallery();
  }

  loadGallery(): void {
    this.isLoading = true;
    this.galleryService.getAll().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          // Filter out PDFs as requested
          this.galleryList = data.filter((item: any) => item.isActive && item.type !== 'pdf');
        } else {
          this.galleryList = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading gallery:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openLightbox(index: number): void {
    this.currentIndex = index;
    this.showLightbox = true;
  }

  closeLightbox(): void {
    this.showLightbox = false;
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    this.currentIndex = (this.currentIndex + 1) % this.galleryList.length;
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    this.currentIndex = (this.currentIndex - 1 + this.galleryList.length) % this.galleryList.length;
  }
}
