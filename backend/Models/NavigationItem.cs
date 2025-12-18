using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class NavigationItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        
        [StringLength(50)]
        public string? Icon { get; set; } // Bootstrap icon class e.g., 'bi-house'

        // Link can be a route (e.g., /about) or a full URL
        public string? Link { get; set; }

        public int? ParentId { get; set; }
        
        [JsonIgnore] // Prevent cycles in serialization
        [ForeignKey("ParentId")]
        public NavigationItem? Parent { get; set; }

        public List<NavigationItem> Children { get; set; } = new List<NavigationItem>();

        public int Order { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
