using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Notice
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? AttachmentUrl { get; set; }
        
        public DateTime PublishedDate { get; set; } = DateTime.Now;
        
        public DateTime? ExpiryDate { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // Student, Staff, General
        
        public int Priority { get; set; } = 0;
    }
}
