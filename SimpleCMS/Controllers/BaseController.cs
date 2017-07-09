using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.Owin;
using SimpleCMS.Models;

namespace SimpleCMS.Controllers
{
    public class BaseController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private ApplicationRoleManager _roleManager;
        private ApplicationDbContext _dbContext;

        public BaseController()
        {
        }

        public BaseController(ApplicationUserManager userManager, ApplicationSignInManager signInManager, ApplicationRoleManager roleManager, ApplicationDbContext dbContext)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            RoleManager = roleManager;
            DbContext = dbContext;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ApplicationRoleManager RoleManager
        {
            get
            {
                return _roleManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationRoleManager>();
            }
            private set
            {
                _roleManager = value;
            }
        }

        public ApplicationDbContext DbContext
        {
            get
            {
                return _dbContext ?? HttpContext.GetOwinContext().GetUserManager<ApplicationDbContext>();
            }
            private set
            {
                _dbContext = value;
            }
        }
    }
}