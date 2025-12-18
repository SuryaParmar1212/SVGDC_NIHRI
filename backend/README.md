# Backend Setup Instructions

## Prerequisites
- .NET SDK 9.0 or higher
- SQL Server (LocalDB, Express, or Full version)

## Setup Steps

### 1. Restore NuGet Packages
```bash
cd backend
dotnet restore
```

### 2. Update Database Connection String
Edit `appsettings.json` and update the connection string if needed:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=UniversityDB;Trusted_Connection=true;TrustServerCertificate=true;"
}
```

### 3. Create Database Migration
```bash
dotnet ef migrations add InitialCreate
```

### 4. Update Database
```bash
dotnet ef database update
```

### 5. Run the Application
```bash
dotnet run
```

The API will be available at: `http://localhost:5000`
Swagger UI: `http://localhost:5000/swagger`

## API Endpoints

### Announcements
- `GET /api/announcements` - Get all active announcements
- `GET /api/announcements/{id}` - Get announcement by ID
- `POST /api/announcements` - Create new announcement
- `PUT /api/announcements/{id}` - Update announcement
- `DELETE /api/announcements/{id}` - Delete announcement

### News
- `GET /api/news` - Get all active news
- `GET /api/news/{id}` - Get news by ID
- `GET /api/news/category/{category}` - Get news by category
- `POST /api/news` - Create new news
- `PUT /api/news/{id}` - Update news
- `DELETE /api/news/{id}` - Delete news

### Departments
- `GET /api/departments` - Get all departments with faculty
- `GET /api/departments/{id}` - Get department by ID
- `GET /api/departments/category/{category}` - Get departments by category

## Default Admin Credentials
- Username: `admin`
- Email: `admin@university.edu`
- Password: `Admin@123`

## Database Models
- **Announcement** - Site-wide announcements
- **News** - Latest news items
- **Notice** - Notice board items
- **Department** - Academic departments
- **Faculty** - Faculty members
- **Gallery** - Image gallery
- **Event** - College events
- **User** - User authentication
- **Student** - Student information

## Technologies Used
- ASP.NET Core 9.0
- Entity Framework Core 9.0
- SQL Server
- JWT Authentication
- Swagger/OpenAPI
- BCrypt for password hashing
