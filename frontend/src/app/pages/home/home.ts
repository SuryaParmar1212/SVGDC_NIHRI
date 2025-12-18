import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService, News } from '../../services/news.service';
import { AnnouncementService } from '../../services/announcement.service';
import { GalleryService, GalleryItem } from '../../services/gallery.service';
import { CarouselService, CarouselItem } from '../../services/carousel.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  newsList: any[] = [];
  announcementsList: any[] = [];
  galleryList: any[] = [];
  carouselItems: CarouselItem[] = [];
  isLoadingNews: boolean = true;
  isLoadingAnnouncements: boolean = true;
  isLoadingGallery: boolean = true;
  currentSlideIndex: number = 0;

  constructor(
    private newsService: NewsService,
    private announcementService: AnnouncementService,
    private galleryService: GalleryService,
    private carouselService: CarouselService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadNews();
    this.loadAnnouncements();
    this.loadGallery();
    this.loadCarousel();
  }

  loadNews(): void {
    this.isLoadingNews = true;
    this.newsService.getAll().subscribe({
      next: (data: any) => {
        console.log('Raw News Data:', data);
        if (Array.isArray(data)) {
          this.newsList = data.slice(0, 6);
        } else {
          console.error('Expected array for news but got:', data);
          this.newsList = [];
        }
        this.isLoadingNews = false;
        this.cdr.detectChanges(); // Force update
      },
      error: (error: any) => {
        console.error('Error loading news:', error);
        this.isLoadingNews = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAnnouncements(): void {
    this.isLoadingAnnouncements = true;
    this.announcementService.getAll().subscribe({
      next: (data: any) => {
        console.log('Raw Announcement Data:', data);
        if (Array.isArray(data)) {
          this.announcementsList = data.filter((a: any) => a.isActive).slice(0, 5);
        } else {
          console.error('Expected array for announcements but got:', data);
          this.announcementsList = [];
        }
        this.isLoadingAnnouncements = false;
        this.cdr.detectChanges(); // Force update
      },
      error: (error: any) => {
        console.error('Error loading announcements:', error);
        this.isLoadingAnnouncements = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadGallery(): void {
    this.isLoadingGallery = true;
    this.galleryService.getAll().subscribe({
      next: (items: any) => {
        if (Array.isArray(items)) {
          // Filter out PDFs as requested
          this.galleryList = items.filter((i: any) => i.isActive && i.type !== 'pdf').slice(0, 8);
        } else {
          this.galleryList = [];
        }
        this.isLoadingGallery = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading gallery:', error);
        this.isLoadingGallery = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCarousel(): void {
    this.carouselService.getActive().subscribe({
      next: (items: CarouselItem[]) => {
        this.carouselItems = items;
        this.startCarousel();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading carousel:', error);
      }
    });
  }

  startCarousel(): void {
    if (this.carouselItems.length > 1) {
      setInterval(() => {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.carouselItems.length;
        this.cdr.detectChanges();
      }, 5000); // Change slide every 5 seconds
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Gallery Lightbox
  showLightbox = false;
  currentGalleryIndex = 0;

  openLightbox(index: number): void {
    this.currentGalleryIndex = index;
    this.showLightbox = true;
  }

  closeLightbox(): void {
    this.showLightbox = false;
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    this.currentGalleryIndex = (this.currentGalleryIndex + 1) % this.galleryList.length;
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    this.currentGalleryIndex = (this.currentGalleryIndex - 1 + this.galleryList.length) % this.galleryList.length;
  }
}
