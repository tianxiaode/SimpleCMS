using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using SimpleCMS.Helper;
using SimpleCMS.LocalResources;
using SimpleCMS.Migrations;
using SimpleCMS.Models;

namespace SimpleCMS
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<ApplicationDbContext, Configuration>());
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            bool isAjaxCall = string.Equals("XMLHttpRequest", Context.Request.Headers["x-requested-with"],
                StringComparison.OrdinalIgnoreCase);
            var exception = Server.GetLastError();
            Response.Clear();
            var httpStatusCode = (exception as HttpException)?.
                                 GetHttpCode() ?? 500;
            string msg = "";
            switch (httpStatusCode)
            {
                case 403:
                    msg = Message.Forbid403;
                    break;
                case 404:
                    msg = Message.NotFound404;
                    break;
                case 500:
                    msg = Message.InternalServerError500;
                    break;
                default:
                    msg = Message.OtherError;
                    break;
            }

            Server.ClearError();
            if (isAjaxCall)
            {
                Response.Write(ExtJs.WriterJObject(false, msg: msg).ToString()); ;
            }
            else
            {
                Response.Charset = "utf-8";
                Response.Write(msg);
            }
            Response.End();

        }

    }
    
}
