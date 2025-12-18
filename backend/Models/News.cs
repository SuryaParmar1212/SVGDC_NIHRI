using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class News
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        
        public DateTime PublishedDate { get; set; } = DateTime.Now;
        
        public bool IsActive { get; set; } = true;
        
        [MaxLength(100)]
        public string Author { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? PdfUrl { get; set; }
    }
}
