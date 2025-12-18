using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Page
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [StringLength(200)]
        public string Slug { get; set; }

        public string Content { get; set; } // HTML Content

        public string? SidebarContent { get; set; } // Optional Sidebar HTML

        public string LayoutType { get; set; } = "Standard"; // Standard, Sidebar, FullWidth

        public string? BackgroundImageUrl { get; set; }
        public string? MetaDescription { get; set; }

        public bool IsPublished { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
    }
}
