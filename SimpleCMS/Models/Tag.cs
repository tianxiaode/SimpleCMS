using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using SimpleCMS.Models;

namespace SimpleCMS.Models
{ 

    [Table("T_Tag")]
    public class Tag
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        [Column(TypeName = "nvarchar")]
        [Index("IX_TAG_TAGNAME", IsUnique = true)]
        public string Name { get; set; }

        public virtual ICollection<Content> Contents { get; set; }
    }
}