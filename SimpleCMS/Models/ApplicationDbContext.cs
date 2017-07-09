using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;
using NLog;

namespace SimpleCMS.Models
{
    public class ApplicationDbContext: IdentityDbContext<ApplicationUser, ApplicationRole, int,
        ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public ApplicationDbContext() : base("DefaultConnection")
        {
            Database.Log = Logger.Info;
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Content> Contents { get; set; }
        public DbSet<Media> Mediae { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
    }
}