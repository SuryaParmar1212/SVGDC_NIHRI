import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-nss',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="nss-page">
      <div class="page-header">
        <div class="container">
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1>National Service Scheme (NSS)</h1>
          <p>NOT ME BUT YOU - Service to the Nation</p>
        </div>
      </div>

      <div class="container">
        <div class="content-section">
          <div class="info-card">
            <h2>About NSS</h2>
            <p>The National Service Scheme (NSS) is a Central Sector Scheme of Government of India, Ministry of Youth Affairs & Sports. It provides opportunity to the student youth of 11th & 12th Class of schools at +2 Board level and student youth of Technical Institution, Graduate & Post Graduate at colleges and University level of India to take part in various government led community service activities & programmes.</p>
          </div>

          <div class="pdf-viewer-card">
            <h2>NSS Activities Report</h2>
            <p class="subtitle">View our latest NSS activities and achievements</p>
            
            <div class="pdf-container">
              <iframe 
                [src]="pdfUrl" 
                type="application/pdf"
                width="100%" 
                height="800px"
                frameborder="0">
              </iframe>
            </div>

            <div class="download-section">
              <a href="/assets/pdf/NSS-Activities.pdf" download class="download-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
              </a>
            </div>
          </div>

          <div class="objectives-card">
            <h2>NSS Objectives</h2>
            <ul>
              <li>Understand the community in which they work</li>
              <li>Understand themselves in relation to their community</li>
              <li>Identify the needs and problems of the community and involve them in problem-solving</li>
              <li>Develop among themselves a sense of social and civic responsibility</li>
              <li>Utilise their knowledge in finding practical solutions to individual and community problems</li>
              <li>Develop competence required for group-living and sharing of responsibilities</li>
              <li>Gain skills in mobilising community participation</li>
              <li>Acquire leadership qualities and democratic attitudes</li>
              <li>Develop capacity to meet emergencies and natural disasters</li>
              <li>Practise national integration and social harmony</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .nss-page {
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

    .content-section {
      padding: 3rem 0;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .info-card, .pdf-viewer-card, .objectives-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .info-card h2, .pdf-viewer-card h2, .objectives-card h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem 0;
    }

    .info-card p {
      color: #4b5563;
      font-size: 1.05rem;
      line-height: 1.7;
      margin: 0;
    }

    .subtitle {
      color: #6b7280;
      font-size: 1rem;
      margin: 0 0 1.5rem 0;
    }

    .pdf-container {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }

    .pdf-container iframe {
      display: block;
      border: none;
    }

    .download-section {
      text-align: center;
    }

    .download-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #4f46e5;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }

    .download-btn:hover {
      background: #4338ca;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }

    .objectives-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 1rem;
    }

    .objectives-card li {
      padding-left: 2rem;
      position: relative;
      color: #374151;
      font-size: 1rem;
      line-height: 1.6;
    }

    .objectives-card li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: 700;
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .pdf-container iframe {
        height: 500px;
      }
    }
  `]
})
export class NSSComponent {
    pdfUrl: SafeResourceUrl;

    constructor(
        private router: Router,
        private sanitizer: DomSanitizer
    ) {
        // Sanitize the PDF URL for security
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/pdf/NSS-Activities.pdf');
    }

    goBack(): void {
        this.router.navigate(['/']);
    }
}
