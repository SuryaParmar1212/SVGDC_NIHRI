using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string RollNumber { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string? Phone { get; set; }
        
        public DateTime DateOfBirth { get; set; }
        
        [MaxLength(10)]
        public string Gender { get; set; } = string.Empty;
        
        public string Address { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string Course { get; set; } = string.Empty;
        
        public int Semester { get; set; }
        
        public int AdmissionYear { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        // Foreign Key
        public int? UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        public int? DepartmentId { get; set; }
        
        [ForeignKey("DepartmentId")]
        public Department? Department { get; set; }
    }
}
