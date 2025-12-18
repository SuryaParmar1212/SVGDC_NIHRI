# Government University Website - Frontend

## Overview
This is the Angular frontend for the Government University website, inspired by the layout of https://www.vgcmandi.co.in/

## Technology Stack
- **Angular**: 18+
- **Bootstrap**: 5.3
- **TypeScript**: Latest
- **Bootstrap Icons**: For iconography

## Features

### Pages
1. **Home Page**
   - Hero slider with carousel
   - Announcement ticker
   - Quick links section
   - Programs showcase (Arts, Commerce, Sciences)
   - Latest news and notice board
   - Tabbed information sections (Student Zone, Staff Corner, External Links)
   - Statistics section

2. **About Page**
   - College history and overview
   - Vision & Mission
   - Principal's message
   - Quick facts
   - Accreditation & recognition

3. **Departments Page**
   - Arts & Humanities departments
   - Commerce programs
   - Science departments
   - Department details with program information

4. **Admissions Page**
   - Admission process (5 steps)
   - Eligibility criteria
   - Important dates
   - Fee structure
   - Scholarship information
   - Quick links and helpline

### Layout Components
- **Header**: Top bar, announcement ticker, logo, navigation menu
- **Footer**: About section, quick links, student services, contact info

## Project Structure
```
src/
├── app/
│   ├── layout/
│   │   ├── header/          # Header component
│   │   └── footer/          # Footer component
│   ├── pages/
│   │   ├── home/            # Home page
│   │   ├── about/           # About page
│   │   ├── departments/     # Departments page
│   │   └── admissions/      # Admissions page
│   ├── app.ts               # Main app component
│   ├── app.routes.ts        # Route configuration
│   └── app.config.ts        # App configuration
├── assets/
│   └── images/              # Image assets
└── styles.css               # Global styles
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/`

### Build
```bash
npm run build
# or
ng build
```
Build artifacts will be stored in the `dist/` directory.

## Routing
- `/` - Home page
- `/about` - About page
- `/departments` - Departments page
- `/admissions` - Admissions page

## Styling
- Global styles in `src/styles.css`
- Bootstrap 5.3 for responsive layout
- Custom CSS variables for theming:
  - `--primary-color`: #1e3a8a (Blue)
  - `--secondary-color`: #dc2626 (Red)
  - `--accent-color`: #f59e0b (Amber)

## Bootstrap Icons
The project uses Bootstrap Icons for all iconography. Icons are loaded via CDN in the global styles.

## Key Features
- Fully responsive design
- Bootstrap-based UI components
- Multi-level navigation menu
- Carousel/slider for hero section
- Announcement ticker animation
- Tabbed content sections
- Card-based layouts
- Professional color scheme

## Customization

### Changing Colors
Edit the CSS variables in `src/styles.css`:
```css
:root {
  --primary-color: #1e3a8a;
  --secondary-color: #dc2626;
  --accent-color: #f59e0b;
}
```

### Adding New Pages
1. Generate component: `ng generate component pages/page-name`
2. Add route in `app.routes.ts`
3. Add navigation link in header component

### Updating College Information
- Logo: Replace `assets/images/logo.png`
- College name: Update in `header.component.html`
- Contact details: Update in `header.component.html` and `footer.component.html`

## Backend Integration
To connect with the .NET backend:
1. Update API URL in environment files
2. Create services in `src/app/services/`
3. Use HttpClient to make API calls
4. Update components to use services

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements
- [ ] Connect to backend API
- [ ] Add authentication
- [ ] Implement admin panel
- [ ] Add image gallery
- [ ] Implement search functionality
- [ ] Add student/staff portals
- [ ] Integrate payment gateway
- [ ] Add multilingual support

## Notes
- Currently, the frontend is standalone with static content
- No database connections are implemented
- All data is hardcoded in components
- Ready for backend integration

## License
Government University Project
