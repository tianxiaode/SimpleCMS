using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SimpleCMS.Helper;

namespace SimpleCMS.Controllers
{
    public class VerifyCodeController : Controller
    {
        // GET: VverifyCode
        public FileContentResult Index()
        {
            var v = new VerifyCode();
            var code = v.CreateVerifyCode();                //取随机码
            Session["VerifyCode"] = code;
            v.Padding = 10;
            var bytes = v.CreateImage(code);
            return File(bytes, @"image/jpeg");
        }
    }
}