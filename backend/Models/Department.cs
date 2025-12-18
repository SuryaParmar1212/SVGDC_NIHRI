using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Department
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // Arts, Commerce, Science
        
        [MaxLength(100)]
        public string? HeadOfDepartment { get; set; }
        
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        // Navigation property
        public ICollection<Faculty>? Faculty { get; set; }
    }
}
