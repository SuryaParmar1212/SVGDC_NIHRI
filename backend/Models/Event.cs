using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        public DateTime EventDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        
        [MaxLength(200)]
        public string? Venue { get; set; }
        
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // Academic, Cultural, Sports, etc.
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
