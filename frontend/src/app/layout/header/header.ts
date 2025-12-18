import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';
import { NavigationService, NavigationItem } from '../../services/navigation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  announcements: any[] = [];
  navigationItems: NavigationItem[] = [];

  constructor(
    private announcementService: AnnouncementService,
    private navigationService: NavigationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAnnouncements();
    this.loadNavigation();
  }

  loadNavigation(): void {
    this.navigationService.getNavigationTree().subscribe({
      next: (data) => {
        this.navigationItems = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load navigation', err)
    });
  }

  loadAnnouncements(): void {
    this.announcementService.getAll().subscribe({
      next: (data: any) => {
        // Filter for active announcements only
        this.announcements = Array.isArray(data) ? data.filter((a: any) => a.isActive) : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load header announcements', err);
        // Fallback to empty to avoid breaking UI
        this.announcements = [];
        this.cdr.detectChanges();
      }
    });
  }
}
