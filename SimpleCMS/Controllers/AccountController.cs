using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json.Linq;
using SimpleCMS.Helper;
using SimpleCMS.LocalResources;
using SimpleCMS.Models;

namespace SimpleCMS.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        // GET: Account
        [AllowAnonymous]
        [HttpPost]
        public async Task<JObject> Login(LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJs.WriterJObject(false, errors: ExtJs.ModelStateToJObject(ModelState));
            }
            var verifyCode = (string)Session["VerifyCode"] ?? "";
            if (string.IsNullOrEmpty(model.VerifyCode) || !string.Equals(verifyCode, model.VerifyCode, StringComparison.CurrentCultureIgnoreCase))
            {
                return ExtJs.WriterJObject(false, errors: new JObject() { { "VerifyCode", Message.VerifyCode } });
            }
            var user = await UserManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return ExtJs.WriterJObject(false, errors: new JObject()
                {
                    {"UserName", Message.SignInFailure} ,
                    {"Password", Message.SignInFailure}
                });
            }
            if (!user.IsApprove)
            {
                return ExtJs.WriterJObject(false, errors: new JObject()
                {
                    { "UserName", Message.IsApprove}
                });
            }
            var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe == "on", shouldLockout: true);
            switch (result)
            {
                case SignInStatus.Success:
                    user.LastLogin = DateTime.Now;
                    await UserManager.UpdateAsync(user);
                    return ExtJs.WriterJObject(true);
                case SignInStatus.LockedOut:
                    return ExtJs.WriterJObject(false, errors: new JObject()
                    {
                        new JProperty("UserName", Message.LockedOut)
                    });
                case SignInStatus.RequiresVerification:
                case SignInStatus.Failure:
                default:
                    return ExtJs.WriterJObject(false, errors: new JObject()
                    {
                        new JProperty("UserName", Message.SignInFailure),
                        new JProperty("Password", Message.SignInFailure)
                    });
            }

        }

        [AllowAnonymous]
        public async Task<JObject> UserInfo()
        {
            if (!User.Identity.IsAuthenticated) return ExtJs.WriterJObject(false);
            if (CurrentUser == null) return ExtJs.WriterJObject(false);
            var roles = await UserManager.GetRolesAsync(CurrentUser.Id);
            return ExtJs.WriterJObject(true, data: new JObject()
            {
                {
                    "UserInfo", new JObject()
                    {
                        {"UserName", CurrentUser.UserName},
                        {"Roles", JArray.FromObject(roles)}
                    }
                },
                {"Menu", GetMenu(roles.Contains("系统管理员"))}
            });
        }

        private JArray GetMenu(bool isAdmin)
        {
            //这里可以从数据库获取导航菜单返回
            var menus = new JArray()
            {
                new JObject(){
                    { "text" , "文章管理"},
                    { "iconCls" , "x-fa fa-file-text-o"},
                    { "rowCls" , "nav-tree-badge"},
                    { "viewType", "articleView" },
                    { "routeId", "articleview" },
                    { "leaf", true }
                },
                new JObject()
                {
                    { "text" , "媒体管理"},
                    { "iconCls" , "x-fa fa-file-image-o"},
                    { "rowCls" , "nav-tree-badge"},
                    { "viewType", "mediaView" },
                    { "routeId", "mediaView" },
                    { "leaf", true }
                }
            };
            if (isAdmin)
            {
                menus.Add(new JObject()
                {
                    { "text" , "用户管理"},
                    { "iconCls" , "x-fa fa-user"},
                    { "rowCls" , "nav-tree-badge"},
                    { "viewType", "userView" },
                    { "routeId", "userView" },
                    { "leaf", true }
                });
            }
            return menus;
        }

        public JObject LogOut()
        {
            SignInManager.AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return ExtJs.WriterJObject(true);
        }

        public async Task<JObject> PasswordReset(PasswordResetModel model)
        {
            if (model.Password.Equals(model.NewPassword))
            {
                ModelState.AddModelError("Password", Message.OldPasswordEqualNew);
            }
            if (!ModelState.IsValid)
            {
                return ExtJs.WriterJObject(false, errors: ExtJs.ModelStateToJObject(ModelState));
            }
            var userId = User.Identity.GetUserId<int>();
            var result = await UserManager.ChangePasswordAsync(userId, model.Password, model.NewPassword);
            if (result.Succeeded)
            {
                SignInManager.AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
                return ExtJs.WriterJObject(true);
            }
            else
            {
                return ExtJs.WriterJObject(false, errors: new JObject()
                {
                    { "Password", string.Join("<br/>", result.Errors)}
                });
            }
        }


    }
}