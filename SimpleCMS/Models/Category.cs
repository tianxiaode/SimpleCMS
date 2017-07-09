using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using SimpleCMS.Validations;

namespace SimpleCMS.Models
{
    [Table("T_Category")]
    public class Category
    {
        [Key]
        public int Id { get; set; }

        public int? ParentId { get; set; }

        [ForeignKey("ParentId")]
        public virtual Category Parent { get; set; }

        public virtual ICollection<Category> SubCategories { get; set; }

        [DefaultValue(0)]
        public int HierarchyLevel { get; set; }

        [MaxLength(100)]
        [Column(TypeName = "nvarchar")]
        public string FullPath { get; set; }

        [Required]
        [MaxLength(255)]
        [Column(TypeName = "nvarchar")]
        public string Title { get; set; }

        [MaxLength(255)]
        [Column(TypeName = "nvarchar")]
        public string Image { get; set; }

        [MaxLength(4000)]
        [Column(TypeName = "nvarchar")]
        public string Content { get; set; }

        [Required]
        [Index("IX_Category_SortOrder")]
        [DefaultValue(0)]
        public int SortOrder { get; set; }

        [Required]
        [DefaultValue(0)]
        [Range(0, 1)]
        public byte State { get; set; }

        [Required]
        [DefaultDateTimeValue("Now")]
        public DateTime? Created { get; set; }

        public virtual ICollection<Content> Contents { get; set; }

    }
}