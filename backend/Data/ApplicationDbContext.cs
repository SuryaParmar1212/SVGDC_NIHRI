using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<CarouselItem> CarouselItems { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<Notice> Notices { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<NavigationItem> NavigationItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Faculty>()
                .HasOne(f => f.Department)
                .WithMany(d => d.Faculty)
                .HasForeignKey(f => f.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.Department)
                .WithMany()
                .HasForeignKey(s => s.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Departments
            modelBuilder.Entity<Department>().HasData(
                new Department
                {
                    Id = 1,
                    Name = "Department of Arts & Humanities",
                    Description = "Offering courses in English, Hindi, History, Political Science, etc.",
                    Category = "Arts",
                    IsActive = true,
                    CreatedDate = DateTime.Now
                },
                new Department
                {
                    Id = 2,
                    Name = "Department of Commerce",
                    Description = "Offering B.Com and M.Com programs",
                    Category = "Commerce",
                    IsActive = true,
                    CreatedDate = DateTime.Now
                },
                new Department
                {
                    Id = 3,
                    Name = "Department of Sciences",
                    Description = "Offering courses in Physics, Chemistry, Mathematics, Biology, etc.",
                    Category = "Science",
                    IsActive = true,
                    CreatedDate = DateTime.Now
                }
            );

            // Seed Admin User
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@university.edu",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"), // You'll need to install BCrypt.Net-Next package
                    FullName = "System Administrator",
                    Role = "Admin",
                    IsActive = true,
                    CreatedDate = DateTime.Now
                }
            );

            // Seed Default Admin
            modelBuilder.Entity<Admin>().HasData(
                new Admin
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@nihricollege.edu",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    FullName = "College Administrator",
                    Role = "Admin",
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow
                }
            );

            // Seed Sample Announcements
            modelBuilder.Entity<Announcement>().HasData(
                new Announcement
                {
                    Id = 1,
                    Title = "Welcome to New Academic Session 2024-25",
                    Content = "The college welcomes all students to the new academic session. Classes will commence from 1st January 2025.",
                    CreatedDate = DateTime.Now,
                    IsActive = true,
                    Priority = 1,
                    CreatedBy = "Admin"
                }
            );

            // Seed Sample News
            modelBuilder.Entity<News>().HasData(
                new News
                {
                    Id = 1,
                    Title = "College Ranked Among Top Institutions",
                    Content = "Our college has been ranked among the top government colleges in the state by NIRF.",
                    PublishedDate = DateTime.Now,
                    Author = "Admin",
                    Category = "Achievement",
                    IsActive = true
                }
            );

            // Seed Sample Pages
            modelBuilder.Entity<Page>().HasData(
                new Page
                {
                    Id = 1,
                    Title = "About Our History",
                    Slug = "history",
                    Content = "<h2>Our Legacy</h2><p>Government Degree College Nihri was established with a vision to serve the rural community...</p>",
                    LayoutType = "Standard",
                    IsPublished = true,
                    CreatedDate = DateTime.Now
                },
                new Page
                {
                    Id = 2,
                    Title = "Academic Programs",
                    Slug = "academics",
                    Content = "<h2>Academic Excellence</h2><p>We offer a wide range of undergraduate programs in Arts, Science, and Commerce.</p>",
                    SidebarContent = "<h5>Quick Links</h5><ul><li>B.A. Faculty</li><li>B.Sc. Faculty</li><li>B.Com. Faculty</li></ul>",
                    LayoutType = "Sidebar",
                    IsPublished = true,
                    CreatedDate = DateTime.Now
                }
            );

            // Seed Sample Navigation Items
            modelBuilder.Entity<NavigationItem>().HasData(
                new NavigationItem { Id = 1, Title = "Home", Link = "/", Order = 1, IsActive = true, Icon = "bi-house-fill" },
                new NavigationItem { Id = 2, Title = "About Us", Link = "/history", Order = 2, IsActive = true, Icon = "bi-info-circle" },
                new NavigationItem { Id = 3, Title = "Academics", Link = "/academics", Order = 3, IsActive = true, Icon = "bi-book" },
                new NavigationItem { Id = 4, Title = "Admissions", Link = "/admissions", Order = 4, IsActive = true, Icon = "bi-person-plus" }
            );
        }
    }
}
