using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Gallery
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Url { get; set; } = string.Empty; // Image or Video Link or PDF Link

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; } // For videos

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = "image"; // image, video, pdf
        
        public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        public int DisplayOrder { get; set; } = 0;
    }
}
