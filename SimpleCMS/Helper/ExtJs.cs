using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using SimpleCMS.LocalResources;
using System.Linq.Dynamic;

namespace SimpleCMS.Helper
{
    public class ExtJs
    {
        public static JObject WriterJObject(
            bool success,
            JObject errors = null,
            int? total = null,
            string msg = null,
            object data = null
        )
        {
            var jo = new JObject()
            {
                { "success", success }
            };
            if (errors != null)
            {
                jo.Add(new JProperty("errors", errors));
            }
            if (total != null)
            {
                jo.Add(new JProperty("total", total));
            }
            if (msg != null)
            {
                jo.Add(new JProperty("msg", msg));
            }
            if (data != null)
            {
                jo.Add(new JProperty("data", data));
            }
            return jo;
        }

        public static JObject ModelStateToJObject(ModelStateDictionary modelState)
        {
            var errors = new JObject();
            var q = modelState.Where(m => !modelState.IsValidField(m.Key)).Select(m => m.Key);
            foreach (var c in q)
            {
                errors.Add(new JProperty(c, string.Join("<br/>",
                    modelState[c].Errors.Select(m => m.ErrorMessage))));
            }
            return errors;
        }

        public static readonly string SortFormatString = "it.{0} {1}";

        public static IQueryable<T> OrderBy<T>(string sortStr, JObject allowSorts, IQueryable<T> queryable)
        {
            var first = allowSorts.Properties().FirstOrDefault();
            if (first == null || string.IsNullOrEmpty((string)first.Value)) throw new HttpException(500, Message.NoAllowSortDefine);
            var defaultSort = string.Format(SortFormatString, first.Value, "");
            if (string.IsNullOrEmpty(sortStr)) return queryable.OrderBy(defaultSort);
            var sortObject = JArray.Parse(sortStr);
            var q = from p in sortObject
                let name = (string)p["property"]
                let dir = (string)p["direction"] == "ASC" ? "ASC" : "DESC"
                from KeyValuePair<string, JToken> property in allowSorts
                let submitname = property.Key
                where name.Equals(submitname)
                select string.Format(SortFormatString, property.Value, dir);
            var sorter = string.Join(",", q);
            return queryable.OrderBy(string.IsNullOrEmpty(sorter) ? defaultSort : sorter);
        }

        public static IQueryable<T> Pagination<T>(int start, int limit, int total, IQueryable<T> queryable)
        {
            if (start < 0 || limit <= 0 || limit > 100) return null;
            return start > total ? null : queryable.Skip(start).Take(limit);
        }

    }
}