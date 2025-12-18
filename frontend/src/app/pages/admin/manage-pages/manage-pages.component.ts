import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageService, Page } from '../../../services/page.service';
import { FileService } from '../../../services/file.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-manage-pages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- GRID VIEW (List of Pages) -->
    <div class="container-fluid mt-4 fade-in" *ngIf="!editingPage">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 class="fw-bold mb-0 text-dark">Website Pages</h2>
            <p class="text-muted small">Manage and design your website content visually</p>
          </div>
          <button class="btn btn-primary btn-lg shadow-sm rounded-pill px-4" (click)="startCreate()">
             <i class="bi bi-plus-lg me-2"></i>Create New Page
          </button>
        </div>

        <div class="row g-4">
          <div class="col-md-4 mb-2" *ngFor="let page of pages">
            <div class="card h-100 shadow-sm border-0 page-card-premium" (click)="editPage(page)">
              <div class="page-preview-thumb" [style.backgroundImage]="'url(' + (page.backgroundImageUrl || 'assets/images/college-bg.jpg') + ')'">
                 <div class="overlay-premium">
                    <div class="text-center">
                        <div class="btn btn-light btn-sm rounded-pill px-3 mb-2 fw-bold text-primary">Open Visual Editor</div>
                        <div class="text-white extra-small opacity-75">Click to customize layout</div>
                    </div>
                 </div>
              </div>
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title fw-bold mb-0 text-truncate text-dark">{{ page.title }}</h5>
                    <button class="btn btn-outline-danger btn-sm border-0 rounded-circle" (click)="deletePage(page); $event.stopPropagation()">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <p class="text-primary small mb-3 fw-medium">
                  <i class="bi bi-globe me-1"></i>/{{ page.slug }}
                </p>
                <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                   <span class="status-pill" [class.published]="page.isPublished">
                      <i class="bi" [class.bi-check-circle-fill]="page.isPublished" [class.bi-file-earmark-lock-fill]="!page.isPublished"></i> 
                      {{ page.isPublished ? 'Published' : 'Draft' }}
                   </span>
                   <span class="layout-pill"><i class="bi bi-grid-1x2-fill me-1"></i> {{ page.layoutType }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div *ngIf="pages.length === 0" class="col-12">
             <div class="empty-state-luxury py-5 text-center">
                <div class="icon-circle mb-4 mx-auto">
                    <i class="bi bi-files text-primary"></i>
                </div>
                <h3 class="fw-bold text-dark">No Pages Found</h3>
                <p class="text-muted mx-auto" style="max-width: 400px;">
                    You haven't created any dynamic pages yet. Click the "Create New Page" button to start building your website content.
                </p>
                <button class="btn btn-outline-primary rounded-pill px-5 mt-3" (click)="startCreate()">
                    Get Started
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VISUAL EDITOR MODE -->
    <div class="visual-editor" *ngIf="editingPage" [class.sidebar-open]="showSettings">
      <!-- Top Navigation Bar -->
      <nav class="editor-nav bg-dark text-white sticky-top p-0 px-3">
         <div class="d-flex justify-content-between align-items-center h-100 py-2">
            <div class="d-flex align-items-center gap-3">
               <button class="btn btn-dark btn-sm rounded-circle shadow-none" (click)="cancelEdit()" title="Back to list">
                  <i class="bi bi-arrow-left"></i>
               </button>
               <div class="page-info">
                   <h6 class="mb-0 fw-bold">{{ editingPage.title }}</h6>
                   <div class="editor-status small" [class.text-success]="saved" [class.text-warning]="!saved">
                      {{ saved ? '✓ Saved' : '● Unsaved' }}
                   </div>
               </div>
            </div>

            <div class="d-flex align-items-center gap-2">
               <button class="btn btn-outline-light btn-sm border-0 rounded-pill px-3" (click)="toggleSettings()" [class.active-btn]="showSettings">
                  <i class="bi bi-sliders2-vertical me-2"></i>Page Settings
               </button>
               <div class="vr bg-light opacity-25 mx-1"></div>
               <button class="btn btn-primary btn-sm px-4 rounded-pill shadow" (click)="savePage()" [disabled]="isLoading">
                  <i class="bi bi-cloud-arrow-up me-2"></i>{{ isLoading ? 'Saving...' : 'Save & Publish' }}
               </button>
            </div>
         </div>
      </nav>

      <!-- Settings Side Panel -->
      <div class="editor-settings-panel shadow-lg" [class.active]="showSettings">
          <div class="p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                  <h5 class="mb-0 fw-bold">Configuration</h5>
                  <button class="btn-close" (click)="toggleSettings()"></button>
              </div>
              
              <div class="form-section mb-4">
                  <label class="section-label">Page Identity</label>
                  <div class="input-group input-group-sm mb-3">
                      <span class="input-group-text bg-light border-0">Slug: /</span>
                      <input type="text" class="form-control border-0 bg-light" [(ngModel)]="editingPage.slug" (ngModelChange)="markUnsaved()">
                  </div>
              </div>

              <div class="form-section mb-4">
                  <label class="section-label">Design & Layout</label>
                  <div class="mb-3">
                      <small class="text-muted d-block mb-1">Hero Background Image</small>
                      <div class="hero-preview-box" [style.backgroundImage]="'url(' + (editingPage.backgroundImageUrl || 'assets/images/college-bg.jpg') + ')'" (click)="changeHeroImage()">
                          <div class="overlay"><i class="bi bi-image"></i> Edit</div>
                      </div>
                  </div>
                  
                  <div class="layout-selector">
                      <div class="layout-btn" [class.active]="editingPage.layoutType === 'Standard'" (click)="setLayout('Standard')">
                          <i class="bi bi-distribute-horizontal"></i><span>Standard</span>
                      </div>
                      <div class="layout-btn" [class.active]="editingPage.layoutType === 'Sidebar'" (click)="setLayout('Sidebar')">
                          <i class="bi bi-layout-sidebar-inset-reverse"></i><span>Sidebar</span>
                      </div>
                      <div class="layout-btn" [class.active]="editingPage.layoutType === 'FullWidth'" (click)="setLayout('FullWidth')">
                          <i class="bi bi-arrows-fullscreen"></i><span>Full Width</span>
                      </div>
                  </div>
              </div>

              <div class="form-section mb-4">
                  <label class="section-label">Search Engine (SEO)</label>
                  <textarea class="form-control form-control-sm border-0 bg-light" rows="4" [(ngModel)]="editingPage.metaDescription" (ngModelChange)="markUnsaved()" placeholder="Describe this page for Google..."></textarea>
              </div>

              <hr class="my-4 opacity-10">

              <div class="d-flex justify-content-between align-items-center">
                  <span class="small fw-bold">Published Status</span>
                  <div class="form-check form-switch">
                      <input class="form-check-input p-2" type="checkbox" role="switch" id="pubSwitch" [(ngModel)]="editingPage.isPublished" (ngModelChange)="markUnsaved()">
                  </div>
              </div>
          </div>
      </div>

      <!-- Live Page Canvas -->
      <div class="editor-canvas">
          <!-- Interactive Hero Section -->
          <div class="editor-hero" [style.backgroundImage]="'url(' + (editingPage.backgroundImageUrl || 'assets/images/college-bg.jpg') + ')'">
              <div class="hero-overlay"></div>
              <div class="container h-100 d-flex align-items-center justify-content-center position-relative" style="z-index: 5;">
                  <div class="text-center text-white px-3 w-75">
                      <h1 class="display-3 fw-bold editable-field" 
                          contenteditable="true" 
                          (blur)="onTitleBlur($event)"
                          [innerHTML]="editingPage.title"></h1>
                      <div class="small opacity-50 mt-3"><i class="bi bi-cursor-fill me-1"></i> Edit title directly</div>
                  </div>
              </div>
          </div>

          <!-- Layout Content Areas -->
          <div class="container py-5">
              <div class="row" [ngClass]="{'justify-content-center': editingPage.layoutType === 'Standard'}">
                  <!-- Main Body Content Area -->
                  <div [ngClass]="{
                    'col-lg-10': editingPage.layoutType === 'Standard',
                    'col-lg-8': editingPage.layoutType === 'Sidebar',
                    'col-lg-12': editingPage.layoutType === 'FullWidth'
                  }">
                      <div class="editor-main-card shadow-sm border-0 mb-5">
                          <div class="card-body p-4 p-md-5">
                              <div class="section-badge mb-3">Main Content Area</div>
                              <div #contentArea 
                                   class="wysiwyg-area page-content-rich" 
                                   contenteditable="true" 
                                   (input)="onContentInput($event)"
                                   [innerHTML]="editingPage.content"></div>
                              
                              <div class="toolbar-hint mt-4 text-center text-muted small">
                                 Select text to style or insert links/images
                              </div>
                          </div>
                      </div>
                  </div>

                  <!-- Sidebar Area (Conditional) -->
                  <div class="col-lg-4" *ngIf="editingPage.layoutType === 'Sidebar'">
                       <div class="card shadow-sm border-0 mb-4 bg-primary text-white sidebar-editor">
                          <div class="card-body p-4">
                             <div class="section-badge bg-white text-primary mb-3">Sidebar Content</div>
                             <div #sidebarArea
                                  class="wysiwyg-area"
                                  contenteditable="true"
                                  (input)="onSidebarInput($event)"
                                  [innerHTML]="editingPage.sidebarContent"></div>
                          </div>
                       </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Floating Text Styling Toolbar -->
      <div class="floating-toolbar shadow-lg animate-pop" *ngIf="showToolbar" [style.top.px]="toolbarY" [style.left.px]="toolbarX">
          <div class="toolbar-group">
              <button (click)="exec('bold')" title="Bold"><i class="bi bi-type-bold"></i></button>
              <button (click)="exec('italic')" title="Italic"><i class="bi bi-type-italic"></i></button>
              <button (click)="exec('underline')" title="Underline"><i class="bi bi-type-underline"></i></button>
          </div>
          <div class="toolbar-divider"></div>
          <div class="toolbar-group">
              <button (click)="exec('formatBlock', 'h1')" title="H1">H1</button>
              <button (click)="exec('formatBlock', 'h2')" title="H2">H2</button>
              <button (click)="exec('formatBlock', 'h3')" title="H3">H3</button>
          </div>
          <div class="toolbar-divider"></div>
          <div class="toolbar-group">
              <button (click)="exec('justifyLeft')" title="Align Left"><i class="bi bi-text-left"></i></button>
              <button (click)="exec('justifyCenter')" title="Align Center"><i class="bi bi-text-center"></i></button>
              <button (click)="exec('justifyRight')" title="Align Right"><i class="bi bi-text-right"></i></button>
          </div>
          <div class="toolbar-divider"></div>
          <div class="toolbar-group">
              <button (click)="openColorPicker()" title="Text Color"><i class="bi bi-palette" [style.color]="activeColor"></i></button>
              <button (click)="insertLink()" title="Add Link"><i class="bi bi-link-45deg"></i></button>
              <button (click)="triggerEditorFileUpload()" title="Upload Image"><i class="bi bi-cloud-arrow-up"></i></button>
          </div>
          <input type="color" #colorPicker style="display: none;" (change)="onColorChange($event)">
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .page-card-premium { 
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); 
        border-radius: 24px; 
        overflow: hidden; 
        cursor: pointer; 
        display: flex; 
        flex-direction: column; 
        background: #fff;
    }
    .page-card-premium:hover { 
        transform: translateY(-12px); 
        box-shadow: 0 30px 60px rgba(0,0,0,0.12) !important; 
    }
    .page-preview-thumb { height: 180px; background-size: cover; background-position: center; position: relative; }
    .overlay-premium { 
      position: absolute; top:0; left:0; right:0; bottom:0; 
      background: rgba(13, 110, 253, 0.8); opacity: 0; transition: 0.4s;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(8px);
    }
    .page-card-premium:hover .overlay-premium { opacity: 1; }
    
    .status-pill { font-size: 0.7rem; padding: 4px 12px; border-radius: 50px; background: #f1f3f5; color: #495057; font-weight: 700; text-transform: uppercase; }
    .status-pill.published { background: #e7faf3; color: #0ca678; }
    .layout-pill { font-size: 0.75rem; color: #adb5bd; font-weight: 500; }

    .empty-state-luxury { background: white; border-radius: 32px; border: 2px dashed #e9ecef; }
    .icon-circle { width: 80px; height: 80px; background: #eef5ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; }

    .visual-editor { background: #f8fafc; min-height: 100vh; position: relative; transition: 0.3s; }
    .visual-editor.sidebar-open { padding-right: 320px; }
    
    .editor-nav { height: 70px; z-index: 2100; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
    .active-btn { background: #0d6efd !important; border-color: #0d6efd !important; color: white !important; }

    .editor-settings-panel {
        position: fixed; top: 0; right: -320px; width: 320px; height: 100vh;
        background: white; z-index: 2050; transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 1px solid #eef0f2; overflow-y: auto;
    }
    .editor-settings-panel.active { right: 0; }
    
    .section-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: #999; font-weight: 800; display: block; margin-bottom: 12px; }
    .hero-preview-box { height: 100px; border-radius: 12px; background: #f0f2f5; position: relative; background-size: cover; background-position: center; cursor: pointer; overflow: hidden; }
    .hero-preview-box .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; opacity: 0; transition: 0.2s; }
    .hero-preview-box:hover .overlay { opacity: 1; }

    .layout-selector { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .layout-btn { background: #f8f9fa; border: 1px solid #eee; border-radius: 10px; padding: 12px 5px; text-align: center; cursor: pointer; transition: 0.2s; }
    .layout-btn i { display: block; font-size: 1.25rem; margin-bottom: 4px; }
    .layout-btn span { font-size: 0.7rem; font-weight: 500; }
    .layout-btn:hover { border-color: #0d6efd; background: #eef5ff; }
    .layout-btn.active { background: #0d6efd; color: white; border-color: #0d6efd; box-shadow: 0 4px 10px rgba(13,110,253,0.3); }

    .editor-hero { height: 450px; background-size: cover; background-position: center; position: relative; display: flex; transition: 0.4s; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4)); }
    .editable-field { cursor: text; padding: 10px 20px; border: 2px dashed transparent; border-radius: 15px; transition: 0.2s; }
    .editable-field:hover { border-color: rgba(255,255,255,0.3); }
    .editable-field:focus { border-color: #0d6efd; outline: none; background: rgba(255,255,255,0.05); }

    .section-badge { display: inline-block; font-size: 0.65rem; background: #f0f2f5; color: #999; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 700; margin-bottom: 1rem; }
    .editor-main-card { border-radius: 20px; background: white; }
    .wysiwyg-area { min-height: 400px; outline: none; font-size: 1.15rem; line-height: 1.8; color: #2c3e50; }
    .sidebar-editor { border-radius: 20px; }

    .floating-toolbar {
      position: fixed; display: flex; align-items: center; background: #1a1a1a; padding: 6px; border-radius: 12px; z-index: 2200;
      border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(12px);
    }
    .toolbar-group { display: flex; gap: 2px; }
    .toolbar-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.1); mx: 8px; }
    .floating-toolbar button {
      background: none; border: none; color: #ddd; width: 36px; height: 36px; border-radius: 8px; transition: 0.2s; display: flex; align-items: center; justify-content: center;
    }
    .floating-toolbar button:hover { background: #333; color: #0d6efd; }
    .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes pop { 0% { transform: scale(0.8) translateY(10px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }

    .extra-small { font-size: 0.65rem; }
  `]
})
export class ManagePagesComponent implements OnInit {
  pages: Page[] = [];
  editingPage: Page | null = null;
  saved = true;
  isLoading = false;
  showToolbar = false;
  showSettings = false;
  toolbarX = 0;
  toolbarY = 0;
  activeColor = '#000000';

  @ViewChild('contentArea') contentArea!: ElementRef;
  @ViewChild('sidebarArea') sidebarArea!: ElementRef;
  @ViewChild('editorFileUpload') editorFileUpload!: ElementRef;
  @ViewChild('colorPicker') colorPicker!: ElementRef;

  constructor(
    private pageService: PageService,
    private fileService: FileService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPages();
    // Monitor text selection for toolbar
    document.onselectionchange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0 && this.editingPage) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          this.toolbarX = rect.left + (rect.width / 2) - 100;
          this.toolbarY = rect.top - 60;
          this.showToolbar = true;
        } catch (e) { this.showToolbar = false; }
      } else {
        this.showToolbar = false;
      }
    };
  }

  loadPages(): void {
    this.pageService.getPages().subscribe({
      next: (data) => {
        this.pages = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load pages', err);
        this.toastService.error('Could not connect to database. Ensure backend is running.');
      }
    });
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  setLayout(type: string): void {
    if (this.editingPage) {
      this.editingPage.layoutType = type;
      this.markUnsaved();
    }
  }

  markUnsaved(): void {
    this.saved = false;
    this.cdr.detectChanges();
  }

  startCreate(): void {
    this.editingPage = {
      title: 'New Page Title',
      slug: 'new-page-' + Math.floor(Math.random() * 1000),
      content: '<p>Start writing your page content here...</p>',
      sidebarContent: '<h5>Sidebar Section</h5><p>Add useful links here.</p>',
      layoutType: 'Standard',
      isPublished: true
    };
    this.saved = false;
    this.showSettings = true;
  }

  editPage(page: Page): void {
    this.editingPage = { ...page };
    this.saved = true;
    this.showSettings = false;
  }

  cancelEdit(): void {
    if (!this.saved) {
      if (!confirm('Discard unsaved changes?')) return;
    }
    this.editingPage = null;
    this.showSettings = false;
  }

  onTitleBlur(event: any): void {
    if (this.editingPage) {
      this.editingPage.title = event.target.innerText;
      this.markUnsaved();
    }
  }

  onContentInput(event: any): void {
    if (this.editingPage) {
      this.editingPage.content = event.target.innerHTML;
      this.markUnsaved();
    }
  }

  onSidebarInput(event: any): void {
    if (this.editingPage) {
      this.editingPage.sidebarContent = event.target.innerHTML;
      this.markUnsaved();
    }
  }

  exec(command: string, value: any = null): void {
    document.execCommand(command, false, value);
    this.markUnsaved();
  }

  openColorPicker(): void {
    this.colorPicker.nativeElement.click();
  }

  onColorChange(event: any): void {
    this.activeColor = event.target.value;
    this.exec('foreColor', this.activeColor);
  }

  insertLink(): void {
    const selection = window.getSelection();
    let defaultUrl = 'https://';
    if (selection && selection.toString().startsWith('http')) {
      defaultUrl = selection.toString();
    }

    const url = prompt('Enter Destination URL:', defaultUrl);
    if (url) {
      this.exec('createLink', url);
    }
  }

  insertImage(): void {
    const url = prompt('Enter Image URL:');
    if (url) this.exec('insertImage', url);
  }

  addBlock(): void {
    const block = '<div class="my-4"><p>New content section added. Edit me!</p></div>';
    this.exec('insertHTML', block);
  }

  changeHeroImage(): void {
    const url = prompt('Enter Hero Background Image URL:', this.editingPage?.backgroundImageUrl || '');
    if (url !== null && this.editingPage) {
      this.editingPage.backgroundImageUrl = url;
      this.markUnsaved();
    }
  }

  savePage(): void {
    if (!this.editingPage) return;
    this.isLoading = true;

    const request = this.editingPage.id
      ? this.pageService.updatePage(this.editingPage.id, this.editingPage)
      : this.pageService.createPage(this.editingPage);

    request.subscribe({
      next: (res: any) => {
        if (!this.editingPage?.id) this.editingPage!.id = res.id;
        this.saved = true;
        this.isLoading = false;
        this.toastService.success('Page saved successfully!');
        this.loadPages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Error saving page. Please check if the slug is unique.');
        console.error(err);
      }
    });
  }

  triggerEditorFileUpload(): void {
    this.editorFileUpload.nativeElement.click();
  }

  onEditorFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.fileService.uploadFile(file).subscribe({
        next: (res: any) => {
          this.exec('insertImage', res.url);
          this.isLoading = false;
          this.toastService.success('Image uploaded and inserted!');
        },
        error: (err) => {
          this.isLoading = false;
          this.toastService.error('Failed to upload image');
        }
      });
    }
  }

  deletePage(page: Page): void {
    if (confirm(`Are you sure you want to permanently delete "${page.title}"?`)) {
      if (page.id) {
        this.pageService.deletePage(page.id).subscribe({
          next: () => {
            this.toastService.success('Page deleted successfully');
            this.loadPages();
          },
          error: () => this.toastService.error('Failed to delete page')
        });
      }
    }
  }
}
