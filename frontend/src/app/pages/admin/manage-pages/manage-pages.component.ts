import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
    <!-- Custom Dialog Modal -->
    <div class="custom-dialog-overlay" *ngIf="dialogConfig.show">
      <div class="custom-dialog-card shadow-lg animate-in">
        <div class="dialog-header p-4 border-bottom">
          <h5 class="mb-0 fw-bold">{{ dialogConfig.title }}</h5>
        </div>
        <div class="dialog-body p-4">
          <p class="text-muted">{{ dialogConfig.message }}</p>
          <div *ngIf="dialogConfig.type === 'prompt'" class="mt-3">
            <label class="small fw-bold text-primary mb-1">{{ dialogConfig.inputLabel || 'Enter Value' }}</label>
            <input type="text" class="form-control" [(ngModel)]="dialogConfig.value" (keyup.enter)="closeDialog(true)" #dialogInput>
          </div>
        </div>
        <div class="dialog-footer p-4 border-top d-flex justify-content-end gap-2">
          <button class="btn btn-light px-4 rounded-pill" (click)="closeDialog(false)" *ngIf="dialogConfig.type !== 'alert'">{{ dialogConfig.cancelText || 'Cancel' }}</button>
          <button class="btn btn-primary px-4 rounded-pill" (click)="closeDialog(true)">{{ dialogConfig.confirmText || (dialogConfig.type === 'confirm' ? 'Confirm' : 'OK') }}</button>
        </div>
      </div>
    </div>

    <!-- Loading Toast (Replaces full-screen overlay) -->
    <div class="upload-progress-toast shadow-lg animate-in" *ngIf="isLoading">
      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
      <div class="ms-2">
        <span class="fw-bold small">Processing...</span>
        <div class="extra-small opacity-75">Please wait, uploading files</div>
      </div>
    </div>

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
                      <input type="text" class="form-control border-0 bg-light" [(ngModel)]="editingPage!.slug" (ngModelChange)="markUnsaved()">
                  </div>
              </div>

              <div class="form-section mb-4">
                  <label class="section-label">Hero Appearance</label>
                  <div class="mb-3">
                      <small class="text-muted d-block mb-1">Background Image</small>
                      <div class="d-flex gap-2 align-items-center mb-2">
                        <div class="hero-preview-box flex-grow-1" [style.backgroundImage]="editingPage?.backgroundImageUrl ? 'url(' + editingPage?.backgroundImageUrl + ')' : ''" [style.backgroundColor]="editingPage?.backgroundColor || '#002147'" (click)="changeHeroImage()">
                            <div class="overlay"><i class="bi bi-image"></i> Edit Image</div>
                        </div>
                        <button class="btn btn-outline-danger btn-sm" *ngIf="editingPage?.backgroundImageUrl" (click)="editingPage!.backgroundImageUrl = ''; markUnsaved()" title="Remove Image">
                            <i class="bi bi-trash"></i>
                        </button>
                      </div>
                  </div>
                  <div class="mb-3">
                      <small class="text-muted d-block mb-1">Background Color (if no image)</small>
                      <input type="color" class="form-control form-control-color w-100" [value]="editingPage?.backgroundColor || '#002147'" (change)="onHeroColorChange($event)" title="Choose Color">
                  </div>
                  
                  <label class="section-label mt-4">Layout</label>
                  <div class="layout-selector">
                      <div class="layout-btn" [class.active]="editingPage?.layoutType === 'Standard'" (click)="setLayout('Standard')">
                          <i class="bi bi-distribute-horizontal"></i><span>Standard</span>
                      </div>
                      <div class="layout-btn" [class.active]="editingPage?.layoutType === 'Sidebar'" (click)="setLayout('Sidebar')">
                          <i class="bi bi-layout-sidebar-inset-reverse"></i><span>Sidebar</span>
                      </div>
                      <div class="layout-btn" [class.active]="editingPage?.layoutType === 'FullWidth'" (click)="setLayout('FullWidth')">
                          <i class="bi bi-arrows-fullscreen"></i><span>Full Width</span>
                      </div>
                  </div>
              </div>

              <div class="form-section mb-4">
                  <label class="section-label">Search Engine (SEO)</label>
                  <textarea class="form-control form-control-sm border-0 bg-light" rows="4" [(ngModel)]="editingPage!.metaDescription" (ngModelChange)="markUnsaved()" placeholder="Describe this page for Google..."></textarea>
              </div>

              <hr class="my-4 opacity-10">

              <div class="d-flex justify-content-between align-items-center">
                  <span class="small fw-bold">Published Status</span>
                  <div class="form-check form-switch">
                      <input class="form-check-input p-2" type="checkbox" role="switch" id="pubSwitch" [(ngModel)]="editingPage!.isPublished" (ngModelChange)="markUnsaved()">
                  </div>
              </div>
          </div>
      </div>

      <!-- Live Page Canvas -->
      <div class="editor-canvas">
          <!-- Interactive Hero Section -->
          <div class="editor-hero" [style.backgroundImage]="editingPage?.backgroundImageUrl ? 'url(' + editingPage?.backgroundImageUrl + ')' : ''" [style.backgroundColor]="editingPage?.backgroundColor || '#002147'">
              <div class="hero-overlay"></div>
              <div class="container h-100 d-flex align-items-center justify-content-center position-relative" style="z-index: 5;">
                  <div class="text-center text-white px-3 w-75">
                      <h1 class="display-3 fw-bold editable-field" 
                          contenteditable="true" 
                          (blur)="onTitleBlur($event)"
                          [innerHTML]="editingPage?.title"></h1>
                      <div class="small opacity-50 mt-3"><i class="bi bi-cursor-fill me-1"></i> Edit title directly</div>
                  </div>
              </div>
          </div>

          <!-- Layout Content Areas -->
          <div class="container py-5">
              <div class="row" [ngClass]="{'justify-content-center': editingPage?.layoutType === 'Standard'}">
                  <!-- Main Body Content Area -->
                  <div [ngClass]="{
                    'col-lg-10': editingPage?.layoutType === 'Standard',
                    'col-lg-8': editingPage?.layoutType === 'Sidebar',
                    'col-lg-12': editingPage?.layoutType === 'FullWidth'
                  }">
                      <div class="editor-main-card shadow-sm border-0 mb-5">
                          <div class="card-body p-4 p-md-5">
                              <div class="section-badge mb-3">Main Content Area</div>
                              <div #contentArea 
                                   class="wysiwyg-area page-content-rich" 
                                   contenteditable="true" 
                                   (input)="onContentInput($event)"
                                   (click)="onContentClick($event)"
                                   [innerHTML]="initialContent"></div>
                              
                              <div class="toolbar-hint mt-4 text-center text-muted small">
                                 Select text to style or insert links/images
                              </div>
                          </div>
                      </div>
                  </div>

                  <!-- Sidebar Area (Conditional) -->
                  <div class="col-lg-4" *ngIf="editingPage?.layoutType === 'Sidebar'">
                       <div class="card shadow-sm border-0 mb-4 bg-primary text-white sidebar-editor">
                          <div class="card-body p-4">
                             <div class="section-badge bg-white text-primary mb-3">Sidebar Content</div>
                             <div #sidebarArea
                                  class="wysiwyg-area"
                                  contenteditable="true"
                                  (input)="onSidebarInput($event)"
                                  (click)="onContentClick($event)"
                                  [innerHTML]="initialSidebarContent"></div>
                          </div>
                       </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Main Editor Toolbar (Floating at Bottom) -->
      <div class="editor-toolbar bg-white shadow-lg py-2 px-4">
          <div class="container d-flex flex-wrap align-items-center gap-2">
              <div class="toolbar-group bg-light p-1 rounded d-flex gap-1" title="Format">
                  <select class="form-select form-select-sm border-0 bg-transparent fw-bold" style="width: 140px;" (change)="exec('formatBlock', $any($event.target).value)">
                      <option value="P">Paragraph</option>
                      <option value="H1">Heading 1</option>
                      <option value="H2">Heading 2</option>
                      <option value="H3">Heading 3</option>
                      <option value="H4">Heading 4</option>
                      <option value="BLOCKQUOTE">Quote</option>
                  </select>
              </div>

              <div class="toolbar-divider mx-1"></div>

              <div class="toolbar-group bg-light p-1 rounded d-flex gap-1">
                  <button class="btn btn-sm btn-light border-0" (click)="exec('bold')" title="Bold"><i class="bi bi-type-bold"></i></button>
                  <button class="btn btn-sm btn-light border-0" (click)="exec('italic')" title="Italic"><i class="bi bi-type-italic"></i></button>
                  <button class="btn btn-sm btn-light border-0" (click)="exec('underline')" title="Underline"><i class="bi bi-type-underline"></i></button>
                  <button class="btn btn-sm btn-light border-0" (click)="exec('strikeThrough')" title="Strikethrough"><i class="bi bi-type-strikethrough"></i></button>
              </div>

              <div class="toolbar-divider mx-1"></div>

              <div class="toolbar-group bg-light p-1 rounded d-flex gap-1">
                  <button class="btn btn-sm btn-light border-0" (click)="exec('justifyLeft')" title="Left"><i class="bi bi-text-left"></i></button>
                  <button class="btn btn-sm btn-light border-0" (click)="exec('justifyCenter')" title="Center"><i class="bi bi-text-center"></i></button>
                  <button class="btn btn-sm btn-light border-0" (click)="exec('justifyRight')" title="Right"><i class="bi bi-text-right"></i></button>
                  <button class="btn btn-sm btn-light border-0" (click)="exec('justifyFull')" title="Justify"><i class="bi bi-text-paragraph"></i></button>
              </div>

              <div class="toolbar-divider mx-1"></div>

              <div class="toolbar-group bg-light p-1 rounded d-flex gap-1">
                  <button class="btn btn-sm btn-light border-0" (click)="exec('insertUnorderedList')" title="Bullet List"><i class="bi bi-list-ul"></i></button>
                  <button class="btn btn-sm btn-light border-0" (click)="exec('insertOrderedList')" title="Number List"><i class="bi bi-list-ol"></i></button>
              </div>

              <div class="toolbar-divider mx-1"></div>

              <div class="toolbar-group bg-light p-1 rounded d-flex gap-1">
                  <div class="d-flex align-items-center px-2 gap-2" title="Text Color">
                    <i class="bi bi-palette small text-muted"></i>
                    <input type="color" class="form-control-color border-0 p-0 bg-transparent" style="width: 24px; height: 24px;" (change)="onColorChange($event)" [value]="activeColor">
                  </div>
                  <button class="btn btn-sm btn-light border-0" (click)="insertLink()" title="Add Link"><i class="bi bi-link-45deg"></i></button>
              </div>

              <div class="toolbar-divider mx-1"></div>

              <!-- Media & Blocks -->
              <div class="toolbar-group p-1 rounded d-flex gap-2 ms-auto">
                  <div class="dropdown">
                    <button class="btn btn-sm btn-primary dropdown-toggle rounded-pill px-3" type="button" data-bs-toggle="dropdown">
                      <i class="bi bi-plus-circle me-1"></i> Add Block
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2">
                      <li><h6 class="dropdown-header">Media</h6></li>
                      <li><button class="dropdown-item rounded" (click)="triggerEditorFileUpload('image')"><i class="bi bi-image me-2"></i> Upload Image(s)</button></li>
                      <li><button class="dropdown-item rounded" (click)="triggerEditorFileUpload('pdf')"><i class="bi bi-file-earmark-pdf me-2"></i> Upload PDF</button></li>
                      <li><button class="dropdown-item rounded" (click)="insertDocumentLink()"><i class="bi bi-link-45deg me-2"></i> Document Link (Text)</button></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><h6 class="dropdown-header">Layout</h6></li>
                      <li><button class="dropdown-item rounded" (click)="insertSideBySide('left')"><i class="bi bi-layout-sidebar me-2"></i> Image Left Block</button></li>
                      <li><button class="dropdown-item rounded" (click)="insertSideBySide('right')"><i class="bi bi-layout-sidebar-reverse me-2"></i> Image Right Block</button></li>
                      <li><button class="dropdown-item rounded" (click)="addBlock()"><i class="bi bi-text-paragraph me-2"></i> Paragraph Block</button></li>
                      <li><button class="dropdown-item rounded" (click)="insertUnderlinedHeading()"><i class="bi bi-type-h2 me-2"></i> Themed Heading</button></li>
                      <li><button class="dropdown-item rounded" (click)="insertThemedButton()"><i class="bi bi-rectangle me-2"></i> Themed Button</button></li>
                    </ul>
                  </div>
              </div>
          </div>
      </div>

      <!-- Hidden Inputs -->
      <input type="file" #editorFileUpload style="display: none;" (change)="onEditorFileSelected($event)" accept="image/*" multiple>
      <input type="file" #pdfUpload style="display: none;" (change)="onPdfSelected($event)" accept="application/pdf">

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

    .editor-canvas { padding-bottom: 120px; } /* Space for floating toolbar */

    .editor-toolbar { 
        position: fixed; 
        bottom: 30px; 
        left: 50%; 
        transform: translateX(-50%); 
        z-index: 2100; 
        border-radius: 100px;
        border: 1px solid rgba(0,0,0,0.1);
        width: auto;
        min-width: 600px;
        max-width: 95%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    ::ng-deep .wysiwyg-area img { 
        width: 100%; 
        height: auto; 
        border-radius: 15px; 
        margin: 2rem 0; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    ::ng-deep .wysiwyg-area a {
        color: #0d6efd;
        text-decoration: underline;
        font-weight: 600;
    }
    .toolbar-divider { width: 1px; height: 24px; background: #dee2e6; }
    .form-control-color::-webkit-color-swatch { border-radius: 4px; border: 1px solid #dee2e6; }
    
    .extra-small { font-size: 0.65rem; }

    /* TinyMCE-like focus for blocks */
    ::ng-deep .side-by-side-row { 
        display: flex; gap: 30px; align-items: center; margin: 30px 0; border: 1px dashed transparent; padding: 10px; transition: 0.2s;
    }
    ::ng-deep .side-by-side-row:hover { border-color: #0d6efd; }
    ::ng-deep .side-image { flex: 1; max-width: 50%; }
    ::ng-deep .side-image img { width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    ::ng-deep .side-content { flex: 1; }
    
    ::ng-deep .underlined-heading { margin: 2rem 0 1.5rem; }
    ::ng-deep .underlined-heading h2 { margin-bottom: 5px; color: #002147; font-weight: 700; }
    ::ng-deep .accent-line { width: 60px; height: 3px; background-color: #ffc107; }

    ::ng-deep .themed-btn { 
        display: inline-block; background: #002147; color: white !important; padding: 12px 30px; border-radius: 6px; 
        text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 10px 0;
    }
    
    ::ng-deep .pdf-viewer-card-dynamic { 
        background: white; border-radius: 12px; padding: 2rem; 
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); margin: 2rem 0;
        position: relative;
    }
    ::ng-deep .pdf-viewer-card-dynamic::after { 
        content: 'PDF PREVIEW'; position: absolute; top: 10px; right: 10px; 
        font-size: 0.6rem; background: #dc3545; color: white; padding: 2px 8px; 
        border-radius: 4px; pointer-events: none; z-index: 10;
    }
    ::ng-deep .pdf-container-embedded { 
        border-radius: 8px; overflow: hidden; 
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
        background: #f1f5f9; border: 1px solid #e2e8f0;
    }

        ::ng-deep .pdf-container-embedded iframe { height: 450px !important; }
    
    ::ng-deep .removable-block { position: relative; transition: all 0.2s; }
    ::ng-deep .removable-block:hover { outline: 2px dashed #dc3545; outline-offset: 4px; border-radius: 8px; }
    ::ng-deep .delete-block-btn { 
        position: absolute; top: -15px; right: -15px; 
        width: 30px; height: 30px; background: #dc3545; color: white; 
        border-radius: 50%; display: flex; align-items: center; justify-content: center; 
        cursor: pointer; opacity: 0; transition: 0.2s; z-index: 100;
        font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    }
    ::ng-deep .removable-block:hover .delete-block-btn { opacity: 1; }

    /* Custom Dialog Styles */
    .custom-dialog-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
        z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .custom-dialog-card {
        background: white; border-radius: 24px; width: 100%; max-width: 450px; overflow: hidden;
    }
    
    .upload-progress-toast {
        position: fixed; 
        bottom: 100px; 
        right: 30px; 
        background: white; 
        padding: 12px 20px; 
        border-radius: 16px; 
        z-index: 10000; 
        display: flex; 
        align-items: center; 
        border: 1px solid #eee;
        box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
    }

    /* Gallery Styles Removed */
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
  isDocumentLinkMode = false;
  isGalleryMode = false;

  dialogConfig = {
    show: false,
    title: '',
    message: '',
    type: 'alert' as 'alert' | 'confirm' | 'prompt',
    inputLabel: '',
    confirmText: '',
    cancelText: '',
    value: '',
    resolve: (val: any) => {}
  };

  @ViewChild('contentArea') contentArea!: ElementRef;
  @ViewChild('sidebarArea') sidebarArea!: ElementRef;
  @ViewChild('editorFileUpload') editorFileUpload!: ElementRef;
  @ViewChild('pdfUpload') pdfUpload!: ElementRef;
  @ViewChild('colorPicker') colorPicker!: ElementRef;

  // Fix for cursor jumping: bind to initial content, not live content
  initialContent: SafeHtml = '';
  initialSidebarContent: SafeHtml = '';
  selectedImageElement: HTMLImageElement | null = null;

  constructor(
    private pageService: PageService,
    private fileService: FileService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadPages();
    this.restoreEditState();
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
    this.persistEditState();
    this.cdr.detectChanges();
  }

  persistEditState(): void {
    if (this.editingPage) {
      // Get current content from DOM
      if (this.contentArea) this.editingPage.content = this.contentArea.nativeElement.innerHTML;
      if (this.sidebarArea) this.editingPage.sidebarContent = this.sidebarArea.nativeElement.innerHTML;
      
      sessionStorage.setItem('cms_edit_page', JSON.stringify(this.editingPage));
      sessionStorage.setItem('cms_edit_saved', JSON.stringify(this.saved));
    }
  }

  restoreEditState(): void {
    const storedPage = sessionStorage.getItem('cms_edit_page');
    const storedSaved = sessionStorage.getItem('cms_edit_saved');
    if (storedPage) {
      this.editingPage = JSON.parse(storedPage);
      this.saved = storedSaved ? JSON.parse(storedSaved) : true;
      this.initialContent = this.sanitizer.bypassSecurityTrustHtml(this.editingPage?.content || '');
      this.initialSidebarContent = this.sanitizer.bypassSecurityTrustHtml(this.editingPage?.sidebarContent || '');
      this.showSettings = false;
    }
  }

  clearEditState(): void {
    sessionStorage.removeItem('cms_edit_page');
    sessionStorage.removeItem('cms_edit_saved');
  }

  startCreate(): void {
    this.editingPage = {
      title: 'New Page Title',
      slug: 'new-page-' + Math.floor(Math.random() * 1000),
      content: '<p>Start writing your page content here...</p>',
      sidebarContent: '<h5>Sidebar Section</h5><p>Add useful links here.</p>',
      layoutType: 'Standard',
      backgroundColor: '#002147',
      isPublished: true
    };
    this.saved = false;
    this.initialContent = this.sanitizer.bypassSecurityTrustHtml(this.editingPage.content || '');
    this.initialSidebarContent = this.sanitizer.bypassSecurityTrustHtml(this.editingPage.sidebarContent || '');
    this.showSettings = true;
    this.persistEditState();
  }

  editPage(page: Page): void {
    this.editingPage = { ...page };
    this.saved = true;
    this.initialContent = this.sanitizer.bypassSecurityTrustHtml(this.editingPage.content || '');
    this.initialSidebarContent = this.sanitizer.bypassSecurityTrustHtml(this.editingPage.sidebarContent || '');
    this.showSettings = false;
    this.persistEditState();
  }

  async cancelEdit(): Promise<void> {
    if (!this.saved) {
      const confirm = await this.openCustomDialog({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        type: 'confirm'
      });
      if (!confirm) return;
    }
    this.editingPage = null;
    this.showSettings = false;
    this.clearEditState();
  }

  openCustomDialog(config: Partial<typeof this.dialogConfig>): Promise<any> {
    return new Promise((resolve) => {
      this.dialogConfig = {
        show: true,
        title: config.title || 'Notification',
        message: config.message || '',
        type: config.type || 'alert',
        inputLabel: config.inputLabel || '',
        confirmText: config.confirmText || '',
        cancelText: config.cancelText || '',
        value: config.value || '',
        resolve: resolve
      };
      this.cdr.detectChanges();
    });
  }

  closeDialog(result: boolean): void {
    const value = this.dialogConfig.value;
    const resolve = this.dialogConfig.resolve;
    this.dialogConfig.show = false;
    this.cdr.detectChanges();
    
    if (this.dialogConfig.type === 'prompt') {
      resolve(result ? value : null);
    } else {
      resolve(result);
    }
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
    const selection = window.getSelection();
    const isInside = selection && selection.rangeCount > 0 && (
        this.contentArea.nativeElement.contains(selection.anchorNode) || 
        (this.sidebarArea && this.sidebarArea.nativeElement.contains(selection.anchorNode))
    );

    if (!isInside) {
        this.contentArea.nativeElement.focus();
        const range = document.createRange();
        range.selectNodeContents(this.contentArea.nativeElement);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

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

  onHeroColorChange(event: any): void {
    if (this.editingPage) {
      this.editingPage.backgroundColor = event.target.value;
      this.markUnsaved();
    }
  }

  async onContentClick(event: any): Promise<void> {
    const target = event.target as HTMLElement;

    // Handle Block Deletion
    if (target.classList.contains('delete-block-btn') || target.parentElement?.classList.contains('delete-block-btn')) {
      const block = target.closest('.removable-block');
      if (block) {
        const confirm = await this.openCustomDialog({
            title: 'Delete Block',
            message: 'Are you sure you want to remove this content block?',
            type: 'confirm'
        });
        if (confirm) {
          block.remove();
          // Trigger update
          if (this.contentArea) this.onContentInput({ target: { innerHTML: this.contentArea.nativeElement.innerHTML } });
        }
      }
      return;
    }

    if (target.tagName === 'IMG') {
      this.selectedImageElement = target as HTMLImageElement;
      const change = await this.openCustomDialog({
          title: 'Update Image',
          message: 'Do you want to replace this image?',
          type: 'confirm'
      });
      if (change) {
        this.triggerEditorFileUpload('image');
      }
    } else {
      this.selectedImageElement = null;
    }
  }

  prepareBlockInsertion(): void {
    let selection = window.getSelection();
    
    // If no selection or selection is outside editor, focus end of main area
    const isInside = selection && selection.rangeCount > 0 && (
        this.contentArea.nativeElement.contains(selection.anchorNode) || 
        (this.sidebarArea && this.sidebarArea.nativeElement.contains(selection.anchorNode))
    );

    if (!isInside) {
        this.contentArea.nativeElement.focus();
        const range = document.createRange();
        range.selectNodeContents(this.contentArea.nativeElement);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
        selection = window.getSelection();
    }

    if (!selection || selection.rangeCount === 0) return;

    let node = selection.anchorNode;
    // Traverse up to find if we are inside a removable-block
    while (node && node !== this.contentArea.nativeElement) {
      if (node.nodeType === 1 && (node as HTMLElement).classList.contains('removable-block')) {
        // Found it! Move cursor after this block
        const range = document.createRange();
        range.setStartAfter(node);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      node = node.parentNode;
    }
  }

  async insertLink(): Promise<void> {
    const selection = window.getSelection();
    let defaultUrl = 'https://';
    if (selection && selection.toString().startsWith('http')) {
      defaultUrl = selection.toString();
    }

    const url = await this.openCustomDialog({
        title: 'Insert Link',
        message: 'Enter the destination URL for the selected text.',
        type: 'prompt',
        inputLabel: 'URL'
    });
    if (url) {
      this.exec('createLink', url);
    }
  }

  insertImage(): void {
    this.triggerEditorFileUpload('image');
  }

  async insertDocumentLink(): Promise<void> {
    const typeSelection = await this.openCustomDialog({
        title: 'Select File Type',
        message: 'Are you uploading a PDF or an Image for this link?',
        type: 'confirm',
        confirmText: 'PDF Document',
        cancelText: 'Image File'
    });
    
    // In our system, 'confirm' returns true (PDF) and 'cancel' returns false (Image)
    const type = typeSelection ? 'pdf' : 'image';

    this.isDocumentLinkMode = true;
    this.triggerEditorFileUpload(type);
  }

  insertSideBySide(align: 'left' | 'right'): void {
    this.prepareBlockInsertion();
    const html = `
      <div class="removable-block mb-3">
        <div class="delete-block-btn" contenteditable="false" title="Remove Block">×</div>
        <div class="side-by-side-row ${align === 'right' ? 'flex-row-reverse' : ''}">
          <div class="side-image">
             <img src="assets/images/college-bg.jpg" alt="Description">
          </div>
          <div class="side-content">
             <h2 class="fw-bold">Section Heading</h2>
             <p>This is a side-by-side content block. You can replace this image by selecting it and using the upload tool, or just edit this text directly.</p>
          </div>
        </div>
      </div>
      <p class="mt-3"><br></p>
    `;
    this.exec('insertHTML', html);
  }

  insertUnderlinedHeading(): void {
    this.prepareBlockInsertion();
    const html = `
      <div class="removable-block mb-3">
         <div class="delete-block-btn" contenteditable="false" title="Remove Block">×</div>
         <div class="underlined-heading">
           <h2>YOUR HEADING HERE</h2>
           <div class="accent-line"></div>
         </div>
      </div>
      <p class="mt-3"><br></p>
    `;
    this.exec('insertHTML', html);
  }

  async insertThemedButton(): Promise<void> {
    const text = await this.openCustomDialog({ title: 'Button Text', message: 'Enter the text to display on the button.', type: 'prompt' });
    if (!text) return;
    const url = await this.openCustomDialog({ title: 'Button Link', message: 'Enter the URL the button should point to.', type: 'prompt' });
    if (url) {
      const html = `<a href="${url}" class="themed-btn">${text}</a> &nbsp;`;
      this.exec('insertHTML', html);
    }
  }

  addBlock(): void {
    this.prepareBlockInsertion();
    const block = `
      <div class="removable-block mb-3">
         <div class="delete-block-btn" contenteditable="false" title="Remove Block">×</div>
         <div class="my-4 p-4 bg-light border rounded">
            <h4 class="fw-bold mb-2">New Section</h4>
            <p>New paragraph block added. Click here to edit this text.</p>
         </div>
      </div>
      <p class="mt-3"><br></p>
    `;
    this.exec('insertHTML', block);
  }

  async changeHeroImage(): Promise<void> {
    const url = await this.openCustomDialog({
        title: 'Hero Image',
        message: 'Enter the URL for the hero background image.',
        type: 'prompt',
        value: this.editingPage?.backgroundImageUrl || ''
    });
    if (url !== null && this.editingPage) {
      this.editingPage.backgroundImageUrl = url;
      this.markUnsaved();
    }
  }

  savePage(): void {
    if (!this.editingPage) return;
    this.persistEditState(); 
    this.isLoading = true;

    const request = this.editingPage.id
      ? this.pageService.updatePage(this.editingPage.id, this.editingPage)
      : this.pageService.createPage(this.editingPage);

    request.subscribe({
      next: (res: any) => {
        if (!this.editingPage?.id) this.editingPage!.id = res.id;
        this.saved = true;
        this.isLoading = false;
        this.clearEditState();
        this.toastService.success('Page saved successfully!');
        this.loadPages();
        this.cdr.detectChanges();
      },
      error: (err :any)  => {
        this.isLoading = false;
        this.toastService.error('Error saving page. Please check if the slug is unique.');
        console.error(err);
      }
    });
  }

  triggerEditorFileUpload(type: 'image' | 'pdf' | 'gallery' = 'image'): void {
    this.isGalleryMode = type === 'gallery';
    if (type === 'pdf') {
      this.pdfUpload.nativeElement.click();
    } else {
      this.editorFileUpload.nativeElement.click();
    }
  }

  onEditorFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.isLoading = true;
      
      const uploadTasks = Array.from(files).map(file => this.fileService.uploadFile(file).toPromise());
      
      Promise.all(uploadTasks).then(async (results: any[]) => {
        if (this.isDocumentLinkMode) {
          const res = results[0];
          const text = await this.openCustomDialog({
            title: 'Link Text',
            message: 'Enter the text to display for this link:',
            type: 'prompt',
            value: files[0].name
          });
          if (text) {
            this.exec('insertHTML', `<a href="${res.url}" target="_blank">${text}</a>`);
          }
        } else if (this.selectedImageElement) {
          this.selectedImageElement.src = results[0].url;
          this.selectedImageElement = null;
          if (this.contentArea) this.onContentInput({ target: { innerHTML: this.contentArea.nativeElement.innerHTML } });
        } else {
          // Insert images wrapped in removable blocks one by one
          results.forEach(res => {
            const html = `
              <div class="removable-block mb-3">
                <div class="delete-block-btn" contenteditable="false" title="Remove Block">×</div>
                <img src="${res.url}" alt="Image">
              </div>
              <p><br></p>
            `;
            this.exec('insertHTML', html);
          });
        }
        
        this.isLoading = false;
        this.isDocumentLinkMode = false;
        this.toastService.success('Files processed successfully!');
        event.target.value = ''; // Reset input to allow re-uploading same file
        this.cdr.detectChanges();
      }).catch(err => {
        this.isLoading = false;
        this.isDocumentLinkMode = false;
        this.toastService.error('Failed to upload one or more files');
        event.target.value = ''; // Reset input even on error
        this.cdr.detectChanges();
      });
    }
  }

  onPdfSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.fileService.uploadFile(file).subscribe({
        next: async (res: any) => {
          if (this.isDocumentLinkMode) {
            const text = await this.openCustomDialog({
                title: 'Link Text',
                message: 'Enter the text to display for this link:',
                type: 'prompt',
                value: file.name
            });
            if (text) {
              this.exec('insertHTML', `<a href="${res.url}" target="_blank">${text}</a>`);
            }
            this.isDocumentLinkMode = false;
          } else {
            this.prepareBlockInsertion();
            const iframeHtml = `
              <div class="removable-block mb-3">
                <div class="delete-block-btn" contenteditable="false" title="Remove Block">×</div>
                <div class="pdf-viewer-card-dynamic my-4">
                  <div class="pdf-container-embedded">
                    <iframe src="${res.url}" type="application/pdf" width="100%" height="750px" frameborder="0"></iframe>
                  </div>
                </div>
              </div>
              <p class="mt-3"><br></p>
            `;
            this.exec('insertHTML', iframeHtml);
          }
          this.isLoading = false;
          this.toastService.success('PDF uploaded successfully!');
          event.target.value = ''; // Reset input
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.isDocumentLinkMode = false;
          this.toastService.error('Failed to upload PDF');
          event.target.value = ''; // Reset input
          this.cdr.detectChanges();
        }
      });
    }
  }

  deletePage(page: Page): void {
    this.openCustomDialog({
      title: 'Delete Page',
      message: `Are you sure you want to permanently delete "${page.title}"?`,
      type: 'confirm'
    }).then((confirm) => {
      if (confirm && page.id) {
        this.pageService.deletePage(page.id).subscribe({
          next: () => {
            this.toastService.success('Page deleted successfully');
            this.loadPages();
          },
          error: () => this.toastService.error('Failed to delete page')
        });
      }
    });
  }
}
