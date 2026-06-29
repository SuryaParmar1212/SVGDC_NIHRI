import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, Admin } from '../../../services/admin.service';
import { NewsService, News } from '../../../services/news.service';
import { AnnouncementService } from '../../../services/announcement.service';
import { GalleryService, GalleryItem } from '../../../services/gallery.service';
import { CarouselService, CarouselItem } from '../../../services/carousel.service';
import { FileService } from '../../../services/file.service';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../../components/toast/toast.component';
import { ManagePagesComponent } from '../manage-pages/manage-pages.component';
import { ManageNavigationComponent } from '../manage-navigation/manage-navigation.component';
import { Header } from '../../../layout/header/header';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, ManagePagesComponent, ManageNavigationComponent, Header],
    templateUrl: './admin-dashboard.html',
    styleUrls: ['./admin-dashboard.css', './modal.css']
})
export class AdminDashboard implements OnInit {
    @ViewChild('newsForm') newsForm!: NgForm;
    @ViewChild('announcementForm') announcementForm!: NgForm;
    @ViewChild('galleryForm') galleryForm!: NgForm;
    @ViewChild('carouselForm') carouselForm!: NgForm;

    currentAdmin: Admin | null = null;
    activeTab: 'news' | 'announcements' | 'gallery' | 'carousel' | 'pages' | 'navigation' | 'welcome' = 'welcome';

    // News
    newsList: News[] = [];
    editingNews: News | null = null;
    newNews: News & { uploadSource: 'url' | 'file', selectedFile?: File } = this.getEmptyNews();

    // Announcements
    announcementsList: any;
    editingAnnouncement: any;
    newAnnouncement: any & {
        uploadSource: 'url' | 'file',
        selectedFile?: File,
        attachmentSource?: 'url' | 'file',
        selectedAttachment?: File
    } = this.getEmptyAnnouncement();

    // Gallery
    galleryList: GalleryItem[] = [];
    editingGalleryItem: GalleryItem | null = null;
    newGalleryItem: GalleryItem = this.getEmptyGalleryItem();

    // Carousel
    carouselList: CarouselItem[] = [];
    editingCarouselItem: CarouselItem | null = null;
    newCarouselItem: CarouselItem = this.getEmptyCarouselItem();

    isLoading: boolean = false;
    isNewsLoading: boolean = false;
    isAnnouncementsLoading: boolean = false;
    isGalleryLoading: boolean = false;
    isCarouselLoading: boolean = false;

    // Track which tabs have been loaded
    newsLoaded: boolean = false;
    announcementsLoaded: boolean = false;
    galleryLoaded: boolean = false;
    carouselLoaded: boolean = false;

    errorMessage: string = '';
    successMessage: string = '';

    // Delete Modal
    showDeleteModal: boolean = false;
    deleteModalTitle: string = '';
    deleteModalMessage: string = '';
    deleteItemId: number | null = null;
    deleteItemType: 'news' | 'announcement' | 'gallery' | 'carousel' | null = null;

    constructor(
        private adminService: AdminService,
        private newsService: NewsService,
        private announcementService: AnnouncementService,
        private galleryService: GalleryService,
        private carouselService: CarouselService,
        private fileService: FileService,
        private toastService: ToastService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        this.currentAdmin = this.adminService.currentAdminValue;
        if (!this.currentAdmin) {
            this.router.navigate(['/admin/login']);
        }
    }

    ngOnInit(): void {
        const savedTab = localStorage.getItem('admin_active_tab');
        if (savedTab) {
            this.activeTab = savedTab as any;
        }
        this.loadTabData(this.activeTab);
    }

    onFileSelected(event: any, target: 'news' | 'announcement' | 'gallery' | 'carousel' | 'attachment'): void {
        const file: File = event.target.files[0];
        if (file) {
            if (target === 'news') {
                this.newNews.selectedFile = file;
            } else if (target === 'announcement') {
                this.newAnnouncement.selectedFile = file;
            } else if (target === 'attachment') {
                this.newAnnouncement.selectedAttachment = file;
            } else if (target === 'gallery') {
                (this.newGalleryItem as any).selectedFile = file;
            } else if (target === 'carousel') {
                this.newCarouselItem.selectedFile = file;
            }
            event.target.value = ''; // Reset input to allow re-uploading same file
        }
    }

    // News Methods
    loadNews(): void {
        if (this.newsLoaded) return;

        this.isNewsLoading = true;
        this.newsService.getAll().subscribe({
            next: (data: any) => {
                if (Array.isArray(data)) {
                    this.newsList = data;
                } else {
                    this.newsList = [];
                }
                this.newsLoaded = true;
                this.isNewsLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                this.toastService.error('Failed to load news');
                this.isNewsLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getEmptyNews(): News & { uploadSource: 'url' | 'file', selectedFile?: File, pdfUploadSource?: 'url' | 'file', selectedPdfFile?: File } {
        return {
            title: '',
            content: '',
            imageUrl: '',
            author: this.currentAdmin?.fullName || '',
            category: '',
            isActive: true,
            pdfUrl: '',
            uploadSource: 'url',
            pdfUploadSource: 'url'
        };
    }

    createNews(): void {
        this.isLoading = true;
        if (!this.newNews.publishedDate) {
            this.newNews.publishedDate = new Date();
        }

        if (this.newNews.uploadSource === 'file' && this.newNews.selectedFile) {
            this.fileService.uploadFile(this.newNews.selectedFile).subscribe({
                next: (response: any) => {
                    this.newNews.imageUrl = response.url;
                    this.saveNews();
                },
                error: (err: any) => {
                    this.showError('Failed to upload image');
                    this.isLoading = false;
                }
            });
        } else {
            this.saveNews();
        }
    }

    saveNews(): void {
        // Remove helper props
        const newsToSave = { ...this.newNews };
        delete (newsToSave as any).uploadSource;
        delete (newsToSave as any).selectedFile;

        this.newsService.create(newsToSave).subscribe({
            next: (news: any) => {
                this.toastService.success('News created successfully!');
                this.newsList.unshift(news);
                this.newNews = this.getEmptyNews();
                if (this.newsForm) {
                    this.newsForm.resetForm(this.getEmptyNews());
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error creating news:', error);
                this.toastService.error('Failed to create news');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    startEditNews(news: News): void {
        this.editingNews = { ...news };
    }

    updateNews(): void {
        if (!this.editingNews || !this.editingNews.id) return;

        this.isLoading = true;
        this.newsService.update(this.editingNews.id, this.editingNews).subscribe({
            next: () => {
                this.toastService.success('News updated successfully!');
                const index = this.newsList.findIndex(n => n.id === this.editingNews!.id);
                if (index !== -1) {
                    this.newsList[index] = { ...this.editingNews! };
                }
                this.editingNews = null;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                this.toastService.error('Failed to update news');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deleteNews(id: number): void {
        this.deleteItemId = id;
        this.deleteItemType = 'news';
        this.deleteModalTitle = 'Delete News';
        this.deleteModalMessage = 'Are you sure you want to delete this news item? This action cannot be undone.';
        this.showDeleteModal = true;
    }

    cancelEditNews(): void {
        this.editingNews = null;
    }

    // Announcement Methods
    loadAnnouncements(): void {
        if (this.announcementsLoaded) return;

        this.isAnnouncementsLoading = true;
        this.announcementService.getAll().subscribe({
            next: (data: any) => {
                if (Array.isArray(data)) {
                    this.announcementsList = data;
                } else {
                    console.error('Expected array for announcements but got:', data);
                    this.announcementsList = [];
                }
                this.announcementsLoaded = true;
                this.isAnnouncementsLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error loading announcements:', error);
                this.toastService.error('Failed to load notices');
                this.isAnnouncementsLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getEmptyAnnouncement(): any & {
        uploadSource: 'url' | 'file',
        selectedFile?: File,
        attachmentSource?: 'url' | 'file',
        selectedAttachment?: File
    } {
        return {
            title: '',
            content: '',
            createdBy: this.currentAdmin?.fullName || '',
            priority: 0,
            isActive: true,
            uploadSource: 'url',
            attachmentSource: 'url'
        };
    }

    createAnnouncement(): void {
        this.isLoading = true;

        if (this.newAnnouncement.expiryDate) {
            this.newAnnouncement.expiryDate = new Date(this.newAnnouncement.expiryDate);
        }

        // Handle Attachment Upload First
        if (this.newAnnouncement.attachmentSource === 'file' && this.newAnnouncement.selectedAttachment) {
            this.fileService.uploadFile(this.newAnnouncement.selectedAttachment).subscribe({
                next: (response: any) => {
                    this.newAnnouncement.attachmentUrl = response.url;
                    this.saveAnnouncement();
                },
                error: (err: any) => {
                    this.showError('Failed to upload attachment');
                    this.isLoading = false;
                }
            });
        } else {
            this.saveAnnouncement();
        }
    }

    saveAnnouncement(): void {
        // Remove helper props
        const annToSave = { ...this.newAnnouncement };
        delete (annToSave as any).uploadSource;
        delete (annToSave as any).selectedFile;
        delete (annToSave as any).attachmentSource;
        delete (annToSave as any).selectedAttachment;

        this.announcementService.create(annToSave).subscribe({
            next: (announcement: any) => {
                this.toastService.success('Notice created successfully!');
                if (!this.announcementsList) this.announcementsList = [];
                this.announcementsList.unshift(announcement);
                this.newAnnouncement = this.getEmptyAnnouncement();
                if (this.announcementForm) {
                    this.announcementForm.resetForm(this.getEmptyAnnouncement());
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error creating announcement:', error);
                this.toastService.error('Failed to create notice');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    startEditAnnouncement(announcement: any): void {
        this.editingAnnouncement = { ...announcement };
    }

    updateAnnouncement(): void {
        if (!this.editingAnnouncement || !this.editingAnnouncement.id) return;

        this.isLoading = true;

        if (this.editingAnnouncement.expiryDate) {
            this.editingAnnouncement.expiryDate = new Date(this.editingAnnouncement.expiryDate);
        }

        this.announcementService.update(this.editingAnnouncement.id, this.editingAnnouncement).subscribe({
            next: () => {
                this.toastService.success('Notice updated successfully!');
                const index = this.announcementsList.findIndex((a: any) => a.id === this.editingAnnouncement!.id);
                if (index !== -1) {
                    this.announcementsList[index] = { ...this.editingAnnouncement! };
                }
                this.editingAnnouncement = null;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                this.toastService.error('Failed to update notice');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deleteAnnouncement(id: number): void {
        this.deleteItemId = id;
        this.deleteItemType = 'announcement';
        this.deleteModalTitle = 'Delete Notice';
        this.deleteModalMessage = 'Are you sure you want to delete this notice? This action cannot be undone.';
        this.showDeleteModal = true;
    }

    cancelEditAnnouncement(): void {
        this.editingAnnouncement = null;
    }

    // Gallery Methods
    loadGallery(): void {
        if (this.galleryLoaded) return;

        this.isGalleryLoading = true;
        this.galleryService.getAll().subscribe({
            next: (data: any) => {
                if (Array.isArray(data)) {
                    this.galleryList = data;
                } else {
                    console.error('Expected array for gallery but got:', data);
                    this.galleryList = [];
                }
                this.galleryLoaded = true;
                this.isGalleryLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error loading gallery:', error);
                this.toastService.error('Failed to load gallery');
                this.isGalleryLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getEmptyGalleryItem(): GalleryItem & { uploadSource: 'url' | 'file', selectedFile?: File } {
        return {
            title: '',
            type: 'image',
            url: '',
            isActive: true,
            uploadSource: 'url'
        };
    }

    createGallery(): void {
        this.isLoading = true;
        this.newGalleryItem.uploadedDate = new Date();

        const item = this.newGalleryItem as any;

        if (item.uploadSource === 'file' && item.selectedFile) {
            this.fileService.uploadFile(item.selectedFile).subscribe({
                next: (response: any) => {
                    this.newGalleryItem.url = response.url;
                    this.saveGalleryItem();
                },
                error: (err: any) => {
                    this.showError('Failed to upload file');
                    this.isLoading = false;
                }
            });
        } else {
            this.saveGalleryItem();
        }
    }

    saveGalleryItem(): void {
        this.galleryService.create(this.newGalleryItem).subscribe({
            next: (item: any) => {
                this.toastService.success('Gallery item created successfully!');
                this.galleryList.unshift(item);
                this.newGalleryItem = this.getEmptyGalleryItem();
                if (this.galleryForm) {
                    this.galleryForm.resetForm(this.getEmptyGalleryItem());
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error creating gallery item:', error);
                this.toastService.error('Failed to create gallery item');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    startEditGallery(item: GalleryItem): void {
        this.editingGalleryItem = { ...item };
    }

    updateGallery(): void {
        if (!this.editingGalleryItem || !this.editingGalleryItem.id) return;

        this.isLoading = true;
        this.galleryService.update(this.editingGalleryItem.id, this.editingGalleryItem).subscribe({
            next: () => {
                this.toastService.success('Gallery item updated successfully!');
                const index = this.galleryList.findIndex(g => g.id === this.editingGalleryItem!.id);
                if (index !== -1) {
                    this.galleryList[index] = { ...this.editingGalleryItem! };
                }
                this.editingGalleryItem = null;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                this.toastService.error('Failed to update gallery item');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deleteGallery(id: number): void {
        this.deleteItemId = id;
        this.deleteItemType = 'gallery';
        this.deleteModalTitle = 'Delete Gallery Item';
        this.deleteModalMessage = 'Are you sure you want to delete this gallery item? This action cannot be undone.';
        this.showDeleteModal = true;
    }

    cancelEditGallery(): void {
        this.editingGalleryItem = null;
    }

    // Carousel Methods
    loadCarousel(): void {
        if (this.carouselLoaded) return;

        this.isCarouselLoading = true;
        this.carouselService.getAll().subscribe({
            next: (data: any) => {
                if (Array.isArray(data)) {
                    this.carouselList = data;
                } else {
                    console.error('Expected array for carousel but got:', data);
                    this.carouselList = [];
                }
                this.carouselLoaded = true;
                this.isCarouselLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error loading carousel:', error);
                this.toastService.error('Failed to load carousel');
                this.isCarouselLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getEmptyCarouselItem(): CarouselItem {
        return {
            imageUrl: '',
            title: '',
            sortOrder: 0,
            isActive: true,
            uploadSource: 'url'
        };
    }

    createCarouselItem(): void {
        this.isLoading = true;

        if (this.newCarouselItem.uploadSource === 'file' && this.newCarouselItem.selectedFile) {
            this.fileService.uploadFile(this.newCarouselItem.selectedFile).subscribe({
                next: (response: any) => {
                    this.newCarouselItem.imageUrl = response.url;
                    this.saveCarouselItem();
                },
                error: (err: any) => {
                    this.showError('Failed to upload image');
                    this.isLoading = false;
                }
            });
        } else {
            this.saveCarouselItem();
        }
    }

    saveCarouselItem(): void {
        // Remove helper props
        const itemToSave = { ...this.newCarouselItem };
        delete (itemToSave as any).uploadSource;
        delete (itemToSave as any).selectedFile;

        this.carouselService.create(itemToSave).subscribe({
            next: (item: any) => {
                this.toastService.success('Carousel item created successfully!');
                this.carouselList.unshift(item);
                this.newCarouselItem = this.getEmptyCarouselItem();
                if (this.carouselForm) {
                    this.carouselForm.resetForm(this.getEmptyCarouselItem());
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error creating carousel item:', error);
                this.toastService.error('Failed to create carousel item');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    startEditCarousel(item: CarouselItem): void {
        this.editingCarouselItem = { ...item };
    }

    updateCarousel(): void {
        if (!this.editingCarouselItem || !this.editingCarouselItem.id) return;
        this.isLoading = true;

        this.carouselService.update(this.editingCarouselItem.id, this.editingCarouselItem).subscribe({
            next: () => {
                this.toastService.success('Carousel item updated successfully!');
                const index = this.carouselList.findIndex(c => c.id === this.editingCarouselItem!.id);
                if (index !== -1) {
                    this.carouselList[index] = { ...this.editingCarouselItem! };
                }
                this.editingCarouselItem = null;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                this.toastService.error('Failed to update carousel item');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deleteCarousel(id: number): void {
        this.deleteItemId = id;
        this.deleteItemType = 'carousel';
        this.deleteModalTitle = 'Delete Carousel Item';
        this.deleteModalMessage = 'Are you sure you want to delete this carousel item? This action cannot be undone.';
        this.showDeleteModal = true;
    }

    cancelEditCarousel(): void {
        this.editingCarouselItem = null;
    }

    setActiveTab(tab: string): void {
        this.activeTab = tab as any;
        localStorage.setItem('admin_active_tab', tab);
        this.loadTabData(tab as any);
        this.cdr.detectChanges();
    }

    loadTabData(tab: 'news' | 'announcements' | 'gallery' | 'carousel' | 'pages' | 'navigation' | 'welcome'): void {
        switch (tab) {
            case 'news':
                this.loadNews();
                break;
            case 'announcements':
                this.loadAnnouncements();
                break;
            case 'gallery':
                this.loadGallery();
                break;
            case 'carousel':
                this.loadCarousel();
                break;
            case 'pages':
                // Handled by child component
                break;
            case 'navigation':
                // Handled by child component
                break;
            case 'welcome':
                // Introduction/Overview
                break;
        }
    }

    logout(): void {
        this.adminService.logout();
        this.router.navigate(['/admin/login']);
    }

    // Legacy methods kept for compatibility
    showSuccess(message: string): void {
        this.toastService.success(message);
    }

    showError(message: string): void {
        this.toastService.error(message);
    }

    // Delete Modal Methods
    confirmDelete(): void {
        if (!this.deleteItemId || !this.deleteItemType) return;

        const id = this.deleteItemId;
        switch (this.deleteItemType) {
            case 'news':
                this.newsService.delete(id).subscribe({
                    next: () => {
                        this.toastService.success('News deleted successfully!');
                        this.newsList = this.newsList.filter(n => n.id !== id);
                        this.cdr.detectChanges();
                    },
                    error: (error: any) => {
                        this.toastService.error('Failed to delete news');
                    }
                });
                break;
            case 'announcement':
                this.announcementService.delete(id).subscribe({
                    next: () => {
                        this.toastService.success('Notice deleted successfully!');
                        this.announcementsList = this.announcementsList.filter((a: any) => a.id !== id);
                        this.cdr.detectChanges();
                    },
                    error: (error: any) => {
                        this.toastService.error('Failed to delete notice');
                    }
                });
                break;
            case 'gallery':
                this.galleryService.delete(id).subscribe({
                    next: () => {
                        this.toastService.success('Gallery item deleted successfully!');
                        this.galleryList = this.galleryList.filter(g => g.id !== id);
                        this.cdr.detectChanges();
                    },
                    error: (error: any) => {
                        this.toastService.error('Failed to delete gallery item');
                    }
                });
                break;
            case 'carousel':
                this.carouselService.delete(id).subscribe({
                    next: () => {
                        this.toastService.success('Carousel item deleted successfully!');
                        this.carouselList = this.carouselList.filter(c => c.id !== id);
                        this.cdr.detectChanges();
                    },
                    error: (error: any) => {
                        this.toastService.error('Failed to delete carousel item');
                    }
                });
                break;
        }

        this.closeDeleteModal();
    }

    closeDeleteModal(): void {
        this.showDeleteModal = false;
        this.deleteItemId = null;
        this.deleteItemType = null;
        this.deleteModalTitle = '';
        this.deleteModalMessage = '';
    }

    // PDF Upload Method
    onPdfSelected(event: any, target: string): void {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                this.toastService.error('PDF file size must be less than 10MB');
                return;
            }

            this.fileService.uploadFile(file).subscribe({
                next: (response: any) => {
                    if (target === 'news') {
                        this.newNews.pdfUrl = response.url;
                        this.toastService.success('PDF uploaded successfully!');
                    } else if (target === 'announcement') {
                        this.newAnnouncement.attachmentUrl = response.url;
                        this.toastService.success('PDF uploaded successfully!');
                    }
                },
                error: (err: any) => {
                    console.error('Error uploading PDF:', err);
                    this.toastService.error('Failed to upload PDF');
                }
            });
            event.target.value = ''; // Reset input
        } else {
            this.toastService.error('Please select a valid PDF file');
            event.target.value = ''; // Reset input
        }
    }
}
