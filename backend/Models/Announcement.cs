using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Announcement
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

        [MaxLength(500)]
        public string? AttachmentUrl { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public DateTime? ExpiryDate { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public int Priority { get; set; } = 0;
        
        [MaxLength(100)]
        public string CreatedBy { get; set; } = string.Empty;
    }
}
