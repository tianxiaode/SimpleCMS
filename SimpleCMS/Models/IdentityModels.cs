using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace SimpleCMS.Models
{
    public class ApplicationUserLogin : IdentityUserLogin<int> { }
    public class ApplicationUserClaim : IdentityUserClaim<int> { }
    public class ApplicationUserRole : IdentityUserRole<int> { }

    public class ApplicationRole : IdentityRole<int, ApplicationUserRole>, IRole<int>
    {
        public string Description { get; set; }

        public ApplicationRole() : base() { }
        public ApplicationRole(string name)
            : this()
        {
            this.Name = name;
        }

        public ApplicationRole(string name, string description)
            : this(name)
        {
            this.Description = description;
        }
    }

    public class ApplicationUser : IdentityUser<int, ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>, IUser<int>
    {
        public async Task<ClaimsIdentity>
            GenerateUserIdentityAsync(UserManager<ApplicationUser, int> manager)
        {
            var userIdentity = await manager
                .CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            return userIdentity;
        }

        public bool IsApprove { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastLogin { get; set; }

        public virtual  ICollection<UserProfile> UserProfiles { get; set; }
    }

    public class ApplicationUserStore :
       UserStore<ApplicationUser, ApplicationRole, int,
       ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>, IUserStore<ApplicationUser, int>, IDisposable
    {
        public ApplicationUserStore()
            : this(new ApplicationDbContext())
        {
            base.DisposeContext = true;
        }

        public ApplicationUserStore(ApplicationDbContext context)
            : base(context)
        {
        }
    }

    public class ApplicationRoleStore
        : RoleStore<ApplicationRole, int, ApplicationUserRole>,
        IQueryableRoleStore<ApplicationRole, int>,
        IRoleStore<ApplicationRole, int>, IDisposable
    {
        public ApplicationRoleStore()
            : base(new ApplicationDbContext())
        {
            base.DisposeContext = true;
        }

        public ApplicationRoleStore(ApplicationDbContext context)
            : base(context)
        {
        }
    }

}