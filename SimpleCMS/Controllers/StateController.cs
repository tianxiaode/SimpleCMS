using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json.Linq;
using SimpleCMS.Models;

namespace SimpleCMS.Controllers
{
    [Authorize]
    public class StateController : BaseController
    {
        // GET: State
        public void Save(string key, string value)
        {
            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(value)) return;
            var userId = User.Identity.GetUserId<int>();
            var q = DbContext.UserProfiles.SingleOrDefault(m => m.Keyword.Equals(key) && m.UserProfileType == (byte)UserProfileType.State && m.UserId == userId);
            if (q == null)
            {
                DbContext.UserProfiles.Add(new UserProfile()
                {
                    Keyword = key,
                    Value = value,
                    UserProfileType = (byte)UserProfileType.State,
                    UserId = userId
                });
            }
            else
            {
                q.Value = value;
            }
            DbContext.SaveChanges();
        }

        public JObject Restore()
        {
            var userId = User.Identity.GetUserId<int>();
            var q = DbContext.UserProfiles.Where(m => m.UserProfileType == (byte)UserProfileType.State && m.UserId == userId).Select(m => new
            {
                Key = m.Keyword,
                Value = m.Value
            });
            return new JObject()
            {
                { "success", true },
                { "data", JArray.FromObject(q) }
            };
        }

    }
}