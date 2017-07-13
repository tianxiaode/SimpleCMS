using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SimpleCMS.LocalResources;

namespace SimpleCMS.Models
{
    public class ContentModel
    {
        public int? Id { get; set; }

        [Required(ErrorMessageResourceName = "Required", ErrorMessageResourceType = typeof(Message))]
        [MaxLength(255)]
        [Display(Name = "ContentTitle", ResourceType = typeof(Message))]
        public string Title { get; set; }

        [Display(Name = "ContentCategoryId", ResourceType = typeof(Message))]
        public int? CategoryId { get; set; }


        [MaxLength(255)]
        [Display(Name = "ContentImage", ResourceType = typeof(Message))]
        public string Image { get; set; }

        [MaxLength(500)]
        [AllowHtml]
        [Display(Name = "ContentSummary", ResourceType = typeof(Message))]
        public string Summary { get; set; }

        [Required(ErrorMessageResourceName = "Required", ErrorMessageResourceType = typeof(Message))]
        [AllowHtml]
        [Display(Name = "ContentBody", ResourceType = typeof(Message))]
        public string Body { get; set; }

        [Required(ErrorMessageResourceName = "Required", ErrorMessageResourceType = typeof(Message))]
        [DefaultValue(0)]
        [Display(Name = "ContentSortOrder", ResourceType = typeof(Message))]
        public int SortOrder { get; set; }

        [Display(Name = "ContentTags", ResourceType = typeof(Message))]
        public string[] Tags { get; set; }

    }
}