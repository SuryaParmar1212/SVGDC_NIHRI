import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="contact-page fade-in">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-overlay"></div>
        <div class="container position-relative" style="z-index: 2;">
          <h1 class="display-4 fw-bold mb-2">Contact Us</h1>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/" class="text-white opacity-75">Home</a></li>
              <li class="breadcrumb-item active text-white" aria-current="page">Contact Us</li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container py-5">
        <div class="row g-4">
          <!-- Contact Info Cards -->
          <div class="col-lg-4">
            <div class="contact-card shadow-sm border-0 mb-4 h-100 p-4 rounded-4 bg-white text-center">
              <div class="icon-box bg-primary text-white mb-3 mx-auto shadow">
                <i class="bi bi-geo-alt-fill fs-3"></i>
              </div>
              <h5 class="fw-bold mb-3 text-dark">Our Location</h5>
              <p class="text-muted leading-relaxed">
                Principal Govt. Degree College Nihri,<br>
                Distt. Mandi H.P. <br>
                Pin Code - 175038
              </p>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="contact-card shadow-sm border-0 mb-4 h-100 p-4 rounded-4 bg-white text-center">
              <div class="icon-box bg-success text-white mb-3 mx-auto shadow">
                <i class="bi bi-telephone-fill fs-3"></i>
              </div>
              <h5 class="fw-bold mb-3 text-dark">Call Us</h5>
              <p class="text-muted leading-relaxed">
                <a href="tel:01907-233674" class="text-decoration-none text-muted">01907-233674</a><br>
                <small>(Office Hours: 10:00 AM - 4:00 PM)</small>
              </p>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="contact-card shadow-sm border-0 mb-4 h-100 p-4 rounded-4 bg-white text-center">
              <div class="icon-box bg-info text-white mb-3 mx-auto shadow">
                <i class="bi bi-envelope-fill fs-3"></i>
              </div>
              <h5 class="fw-bold mb-3 text-dark">Email Us</h5>
              <p class="text-muted leading-relaxed">
                <a href="mailto:gcnihri@gmail.com" class="text-decoration-none text-muted">gcnihri@gmail.com</a><br>
                <small>For general inquiries and support</small>
              </p>
            </div>
          </div>
        </div>

        <!-- Map & Form Section -->
        <div class="row mt-5 g-4">
          <!-- Google Map Embed -->
          <div class="col-lg-7">
            <div class="map-container shadow border-0 rounded-4 overflow-hidden h-100">
              <iframe 
                src="https://maps.google.com/maps?q=Govt%20Degree%20College%20Nihri%20Mandi%20HP&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="500" 
                frameborder="0" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy">
              </iframe>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="col-lg-5">
            <div class="card shadow border-0 rounded-4 p-4 h-100">
              <h4 class="fw-bold mb-4 text-primary">Send us a Message</h4>
              <form>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">FULL NAME</label>
                  <input type="text" class="form-control form-control-lg bg-light border-0" placeholder="Your Name">
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">EMAIL ADDRESS</label>
                  <input type="email" class="form-control form-control-lg bg-light border-0" placeholder="name@example.com">
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">SUBJECT</label>
                  <input type="text" class="form-control form-control-lg bg-light border-0" placeholder="Inquiry Subject">
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">YOUR MESSAGE</label>
                  <textarea class="form-control form-control-lg bg-light border-0" rows="4" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-lg w-100 rounded-pill shadow-sm mt-3">
                  Send Message <i class="bi bi-send ms-2"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .fade-in { animation: fadeIn 0.8s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .page-header {
      height: 300px;
      background-image: url('/images/college-bg.jpg');
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: center;
      color: white;
    }
    .header-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to right, rgba(0,33,71,0.9), rgba(0,33,71,0.6));
    }

    .icon-box {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.3s;
    }
    .contact-card { transition: 0.3s; }
    .contact-card:hover { transform: translateY(-10px); }
    .contact-card:hover .icon-box { transform: scale(1.1); }

    .map-container { position: relative; min-height: 400px; }
    .form-control:focus {
      box-shadow: none;
      background-color: #f8f9fa !important;
      border: 1px solid #0d6efd !important;
    }
    
    .breadcrumb-item + .breadcrumb-item::before { color: rgba(255,255,255,0.5); }
    
    @media (max-width: 768px) {
      .page-header { height: 200px; text-align: center; }
      .breadcrumb { justify-content: center; }
    }
  `]
})
export class ContactUsComponent { }
