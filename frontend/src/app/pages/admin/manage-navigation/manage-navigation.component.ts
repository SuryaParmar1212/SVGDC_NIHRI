import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService, NavigationItem } from '../../../services/navigation.service';
import { PageService, Page } from '../../../services/page.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-manage-navigation',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="header-mgt-container container-fluid mt-4 fade-in">
      <div class="row">
        <div class="col-12 px-4">
          <div class="d-flex justify-content-between align-items-center mb-5">
              <div>
                  <h2 class="fw-bold mb-0 text-dark">Menu & Navigation</h2>
                  <p class="text-muted small">Structure your website hierarchy and dropdowns</p>
              </div>
              <button class="btn btn-primary shadow-sm rounded-pill px-4 py-2 fw-bold" (click)="startCreate()">
                  <i class="bi bi-plus-lg me-2"></i>Add Top Level Menu
              </button>
          </div>

          <!-- Live Preview Card -->
          <div class="card mb-5 shadow-sm border-0 menu-builder-preview">
              <div class="card-header bg-white border-bottom p-4">
                  <div class="d-flex align-items-center justify-content-between">
                     <h6 class="text-uppercase small fw-bold text-primary mb-0">Live Header Preview</h6>
                     <span class="badge bg-light text-dark rounded-pill border">Auto-synced</span>
                  </div>
              </div>
              <div class="card-body p-0">
                  <div class="modern-preview-nav px-4 py-3">
                      <div class="container d-flex align-items-center gap-5">
                          <div class="preview-logo">
                             <img src="assets/images/logo.png" height="40" class="me-2 opacity-50" onerror="this.style.display='none'">
                             <span class="fw-bold fs-5">COLLEGE PORTAL</span>
                          </div>
                          <div class="d-flex gap-4">
                              <div class="preview-menu-item" *ngFor="let item of navigationTree" [class.has-children]="item.children?.length">
                                  <i *ngIf="item.icon" [class]="item.icon" class="me-1 opacity-75"></i>
                                  {{ item.title }}
                                  <i *ngIf="item.children?.length" class="bi bi-chevron-down ms-1 extra-small opacity-50"></i>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="row g-4">
              <!-- Tree View -->
              <div class="col-lg-7">
                  <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                      <div class="card-header bg-light border-0 p-4">
                          <h6 class="mb-0 fw-bold">Menu Architecture</h6>
                      </div>
                      <div class="card-body p-0">
                          <div class="builder-list">
                              <ng-container *ngFor="let item of navigationTree">
                                  <ng-container *ngTemplateOutlet="navItemRowInteractive; context:{ $implicit: item, depth: 0 }"></ng-container>
                              </ng-container>
                              
                              <div *ngIf="navigationTree.length === 0" class="p-5 text-center text-muted">
                                  <div class="icon-bg-circle mb-3"><i class="bi bi-list-ul"></i></div>
                                  <h5 class="fw-bold text-dark">No Menu Items Yet</h5>
                                  <p class="small">Start building your navigation by adding your first menu item.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Editor Sidebar -->
              <div class="col-lg-5">
                  <div class="card border-0 shadow-sm rounded-4 sticky-top editor-card" style="top: 80px;" *ngIf="editingItem">
                      <div class="card-header bg-primary text-white p-4">
                          <h6 class="mb-0 fw-bold">{{ editingItem.id ? 'Modify Item' : 'Create New Item' }}</h6>
                      </div>
                      <div class="card-body p-4">
                          <form (ngSubmit)="saveItem()">
                              <div class="mb-4">
                                  <label class="form-label small fw-bold text-uppercase text-muted opacity-75">Label</label>
                                  <input type="text" class="form-control rounded-3" [(ngModel)]="editingItem.title" name="title" required placeholder="e.g., Departments">
                              </div>

                              <div class="row mb-4">
                                  <div class="col-md-7">
                                      <label class="form-label small fw-bold text-uppercase text-muted opacity-75">Icon Class</label>
                                      <div class="input-group">
                                          <span class="input-group-text bg-light border-0"><i [class]="editingItem.icon || 'bi-link-45deg'"></i></span>
                                          <input type="text" class="form-control border-0 bg-light" [(ngModel)]="editingItem.icon" name="icon" placeholder="bi-star-fill">
                                      </div>
                                  </div>
                                  <div class="col-md-5">
                                      <label class="form-label small fw-bold text-uppercase text-muted opacity-75">Order Index</label>
                                      <input type="number" class="form-control border-0 bg-light" [(ngModel)]="editingItem.order" name="order">
                                  </div>
                              </div>

                              <div class="mb-4">
                                  <label class="form-label small fw-bold text-uppercase text-muted opacity-75">Parent Menu</label>
                                  <select class="form-select border-0 bg-light" [(ngModel)]="editingItem.parentId" name="parentId">
                                      <option [ngValue]="null">--- Top Level (Root) ---</option>
                                      <option *ngFor="let flat of flatItems" [ngValue]="flat.id" [disabled]="flat.id === editingItem.id">
                                          {{ flat.title }}
                                      </option>
                                  </select>
                                  <div class="form-text extra-small mt-2">Nesting more than 2 levels is not recommended for mobile devices.</div>
                              </div>

                              <div class="mb-4">
                                  <label class="form-label small fw-bold text-uppercase text-muted opacity-75">Target Destination</label>
                                  <div class="btn-group w-100 mb-3" role="group">
                                      <button type="button" class="btn btn-sm" [class.btn-dark]="linkType === 'page'" [class.btn-outline-dark]="linkType !== 'page'" (click)="linkType = 'page'">Internal Page</button>
                                      <button type="button" class="btn btn-sm" [class.btn-dark]="linkType === 'custom'" [class.btn-outline-dark]="linkType !== 'custom'" (click)="linkType = 'custom'">External Link</button>
                                  </div>

                                  <div *ngIf="linkType === 'page'" class="animate-in">
                                      <select class="form-select border-0 bg-light" (change)="onPageSelect($event)">
                                          <option value="">--- Choose a Published Page ---</option>
                                          <option *ngFor="let p of pages" [value]="p.slug" [selected]="editingItem.link === '/' + p.slug">
                                              {{ p.title }} (/{{p.slug}})
                                          </option>
                                      </select>
                                  </div>

                                  <div *ngIf="linkType === 'custom'" class="animate-in">
                                      <input type="text" class="form-control border-0 bg-light" [(ngModel)]="editingItem.link" name="link" placeholder="Enter URL (e.g., /all-news or https://google.com)">
                                  </div>
                              </div>

                              <div class="form-check form-switch mb-4 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                                  <label class="form-check-label fw-bold small mb-0" for="activeNav">Show in menu</label>
                                  <input class="form-check-input ms-0 p-2" type="checkbox" role="switch" id="activeNav" [(ngModel)]="editingItem.isActive" name="isActive">
                              </div>

                              <div class="d-flex gap-2">
                                  <button type="button" class="btn btn-light flex-grow-1 py-2 fw-bold" (click)="cancelEdit()">Discard</button>
                                  <button type="submit" class="btn btn-primary flex-grow-1 py-2 fw-bold shadow-sm">Save Changes</button>
                              </div>
                          </form>
                      </div>
                  </div>
                  
                  <!-- Editor Inactive State -->
                  <div class="card border-0 shadow-sm rounded-4 text-center p-5 bg-white" *ngIf="!editingItem">
                      <div class="icon-circle-lg mb-4 mx-auto"><i class="bi bi-pencil-fill"></i></div>
                      <h5 class="fw-bold text-dark">Property Editor</h5>
                      <p class="text-muted small">Select an item from the architecture tree or add a new one to begin editing its properties.</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
     

    <!-- Recursive Template for Interactive List -->
    <ng-template #navItemRowInteractive let-item let-depth="depth">
      <div class="builder-row" [class.active-row]="editingItem?.id === item.id">
          <div class="d-flex align-items-center justify-content-between p-3 border-bottom list-item-hover" [style.paddingLeft.px]="20 + (depth * 30)">
              <div class="d-flex align-items-center">
                  <div class="drag-handle me-3"><i class="bi bi-grip-vertical"></i></div>
                  <div class="nav-icon-box me-3 shadow-sm" *ngIf="item.icon" [class.sub-icon]="depth > 0">
                      <i [class]="item.icon"></i>
                  </div>
                  <div>
                      <div class="fw-bold mb-0 text-dark" [class.small]="depth > 0">{{ item.title }}</div>
                      <div class="extra-small text-primary fw-medium">{{ item.link || 'Mega Menu Group' }}</div>
                  </div>
              </div>
              <div class="action-set">
                  <button class="btn btn-sm btn-light border shadow-sm rounded-circle me-1" (click)="editItem(item)" title="Configure">
                      <i class="bi bi-gear-fill"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger border-0 rounded-circle" (click)="deleteItem(item)" title="Remove">
                      <i class="bi bi-trash"></i>
                  </button>
              </div>
          </div>
          <ng-container *ngIf="item.children && item.children.length > 0">
             <ng-container *ngFor="let child of item.children">
                <ng-container *ngTemplateOutlet="navItemRowInteractive; context:{ $implicit: child, depth: depth + 1 }"></ng-container>
             </ng-container>
          </ng-container>
      </div>
    </ng-template>
  `,
    styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .menu-builder-preview { background: #fbfcfe; border-radius: 20px; border: 1px solid #e2e8f0; }
    .modern-preview-nav { background: #1a202c; color: white; }
    .preview-logo { font-weight: 800; color: #fff; letter-spacing: 1px; }
    .preview-menu-item { font-size: 0.8rem; font-weight: 600; color: #cbd5e0; cursor: default; }
    .preview-menu-item.has-children { color: #fff; }

    .builder-row { transition: 0.2s; background: #fff; }
    .list-item-hover:hover { background: #f8fafc; cursor: pointer; }
    .active-row { background: #f1f7ff; position: relative; }
    .active-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #0d6efd; }
    
    .drag-handle { color: #cbd5e0; cursor: grab; }
    .nav-icon-box { width: 36px; height: 36px; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #0d6efd; border: 1px solid #edf2f7; }
    .nav-icon-box.sub-icon { width: 30px; height: 30px; font-size: 0.9rem; color: #718096; }

    .icon-bg-circle { width: 60px; height: 60px; background: #f7fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #a0aec0; margin: 0 auto; }
    .icon-circle-lg { width: 70px; height: 70px; background: #eef5ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; color: #0d6efd; }

    .editor-card { transition: 0.3s; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }
    .animate-in { animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    .extra-small { font-size: 0.7rem; }
  `]
})
export class ManageNavigationComponent implements OnInit {
    navigationTree: NavigationItem[] = [];
    flatItems: NavigationItem[] = [];
    pages: Page[] = [];
    editingItem: NavigationItem | null = null;
    linkType: 'page' | 'custom' = 'custom';

    constructor(
        private navService: NavigationService,
        private pageService: PageService,
        private toastService: ToastService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.navService.getNavigationTree().subscribe({
            next: (data) => {
                this.navigationTree = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load navigation tree', err);
                this.toastService.error('Could not load menu structure');
            }
        });

        this.navService.getNavigationItems().subscribe({
            next: (data) => {
                this.flatItems = data;
                this.cdr.detectChanges();
            }
        });

        this.pageService.getPages().subscribe({
            next: (data) => {
                this.pages = data;
                this.cdr.detectChanges();
            }
        });
    }

    getDepthPrefix(parentId: number | null | undefined): string {
        return parentId ? '↳' : '';
    }

    startCreate(): void {
        this.editingItem = {
            title: '',
            link: '',
            order: 0,
            isActive: true,
            parentId: null
        };
        this.linkType = 'custom';
    }

    editItem(item: NavigationItem): void {
        this.editingItem = { ...item };
        // Try to detect if it's a page link
        const isPage = this.pages.some(p => this.editingItem?.link === '/' + p.slug);
        this.linkType = isPage ? 'page' : 'custom';
    }

    onPageSelect(event: any): void {
        const slug = event.target.value;
        if (this.editingItem) {
            this.editingItem.link = slug ? `/${slug}` : '';
        }
    }

    cancelEdit(): void {
        this.editingItem = null;
    }

    saveItem(): void {
        if (!this.editingItem) return;

        const action = this.editingItem.id
            ? this.navService.updateNavigationItem(this.editingItem.id, this.editingItem)
            : this.navService.createNavigationItem(this.editingItem);

        action.subscribe({
            next: () => {
                this.toastService.success('Navigation updated successfully!');
                this.refresh();
                this.editingItem = null;
            },
            error: () => this.toastService.error('Failed to update navigation')
        });
    }

    deleteItem(item: NavigationItem): void {
        if (confirm(`Are you sure you want to delete "${item.title}"? All sub-items will also be deleted.`)) {
            if (item.id) {
                this.navService.deleteNavigationItem(item.id).subscribe({
                    next: () => {
                        this.toastService.success('Menu item deleted');
                        this.refresh();
                    },
                    error: () => this.toastService.error('Failed to delete item')
                });
            }
        }
    }
}
