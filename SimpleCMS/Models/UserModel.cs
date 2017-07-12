using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using SimpleCMS.LocalResources;
using SimpleCMS.Validations;

namespace SimpleCMS.Models
{
    public class UserModel
    {
        [Required(ErrorMessageResourceName = "Required", ErrorMessageResourceType = typeof(Message))]
        [Display(Name = "UserUserName", ResourceType = typeof(Message))]
        [MaxLength(100)]
        public string UserName { get; set; }

        [Display(Name = "UserPassword", ResourceType = typeof(Message))]
        [EmptyOrPasswordValidate(allowEmpry: true, requireDigit: true, requireLowercase: true, requireNonLetterOrDigit: false, requireUppercase: false, requiredLength: 6,
            ErrorMessageResourceName = "Password", ErrorMessageResourceType = typeof(Message))]
        public string Password { get; set; }

        [Display(Name = "ConfirmPassword", ResourceType = typeof(Message))]
        [Compare("Password", ErrorMessageResourceName = "Compare", ErrorMessageResourceType = typeof(Message))]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessageResourceName = "Required", ErrorMessageResourceType = typeof(Message))]
        [Display(Name = "Role", ResourceType = typeof(Message))]
        [RegularExpression("^[系统管理员|编辑|注册用户]+$", ErrorMessageResourceName = "UserRoles", ErrorMessageResourceType = typeof(Message))]
        public string Roles { get; set; }


    }
}