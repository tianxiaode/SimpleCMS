using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using SimpleCMS.Helper;
using SimpleCMS.LocalResources;
using SimpleCMS.Models;

namespace SimpleCMS.Controllers
{
    [Authorize]
    public class ContentController : BaseController
    {
        // GET: Content
        private readonly JObject _allowSorts = new JObject()
        {
            { "Id", "Id" },
            { "Title", "Title" },
            { "Created", "Created" },
            { "SortOrder", "SortOrder" },
            { "Hits", "Hits" }
        };

        public async Task<JObject> List(int? cid, DateTime? startDate, DateTime? endDate, string query, int? start, int? limit, string sort)
        {
            var q = DbContext.Contents.Include(m => m.Category).Include(m => m.Tags).Where(m => m.State == 0);
            q = cid !=null && cid >= 10000
                ? q.Where(m => m.CategoryId == cid)
                : cid!=null && cid == 2 ? q.Where(m => m.CategoryId != 10000) : q;
            if (!string.IsNullOrEmpty(query)) q = q.Where(m => m.Title.Contains(query) || m.Summary.Contains(query) || m.Body.Contains(query));
            if (startDate!=null) q = q.Where(m => m.Created > startDate);
            if (endDate!=null) q = q.Where(m => m.Created < endDate);
            var total = await q.CountAsync();
            if (total == 0) return ExtJs.WriterJObject(true, total: 0);
            q = ExtJs.OrderBy(sort, _allowSorts, q);
            q = ExtJs.Pagination(start ?? 0, limit ?? 0, total, q);
            var ja = new JArray();
            if (q == null) return ExtJs.WriterJObject(false, total: total);
            foreach (var c in q)
            {
                ja.Add(new JObject()
                {
                    { "Id", c.Id },
                    { "CategoryId" , c.CategoryId},
                    { "CategoryTitle" , c.Category.Title},
                    { "Title" , c.Title},
                    { "Created" , c.Created?.ToString(Message.DefaultDatetimeFormat) },
                    { "SortOrder" ,c.SortOrder },
                    { "Hits",  c.Hits},
                    { "Tags",  JArray.FromObject(c.Tags.Select(m=>m.Name)) }
                });
            }
            return ExtJs.WriterJObject(true, total: total, data: ja);
        }

        public async Task<JObject> Details(int? id)
        {
            if (id == null) return ExtJs.WriterJObject(false, msg: Message.RecordNoExist);
            var q = await DbContext.Contents.Include(m => m.Category).Include(m => m.Tags).SingleOrDefaultAsync(m => m.Id == id && m.State == 0);
            if (q == null) return ExtJs.WriterJObject(false, msg: Message.RecordNoExist);
            return ExtJs.WriterJObject(true, data: new JObject()
            {
                { "Id", q.Id },
                {"CategoryId", q.CategoryId},
                { "CategoryTitle" , q.Category.Title},
                {"Title", q.Title},
                {"Body", q.Body},
                {"Summary", q.Summary},
                {"SortOrder", q.SortOrder},
                {"Image", q.Image},
                { "Hits",  q.Hits},
                {"Created", q.Created?.ToString(Message.DefaultDatetimeFormat)},
                { "Tags",  string.Join(",",q.Tags.Select(m=>m.Name).ToList())}
            });

        }

        public async Task<JObject> Delete(int[] id)
        {
            if(id == null) return ExtJs.WriterJObject(false, msg: string.Format(Message.DeletedNotExist, Message.Content));
            var q = DbContext.Contents.Where(m => id.Contains(m.Id));
            if (!q.Any())
                return ExtJs.WriterJObject(false, msg: string.Format(Message.DeletedNotExist, Message.Content));
            var msgList = new List<string>();
            foreach (var c in q)
            {
                c.State = 1;
                msgList.Add(string.Format(MessageListItem, "pointthree", string.Format(Message.Deleted, Message.Content, c.Title)));
            }
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true, msg: string.Format(MessageList, string.Join("", msgList)));

        }


        public async Task<JObject> Drop(int[] id, int? cid)
        {
            if (id ==null) return ExtJs.WriterJObject(false, msg: Message.UpdatedNoExist);
            if (cid ==null || !DbContext.Categories.Any(m => m.Id == cid && m.State == 0))
                return ExtJs.WriterJObject(false, msg: Message.InvalidCategoryId);
            var q = DbContext.Contents.Where(m => id.Contains(m.Id));
            if (!q.Any()) return ExtJs.WriterJObject(false, msg: Message.UpdatedNoExist);
            foreach (var c in q)
            {
                c.CategoryId = cid.Value;
            }
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true);
        }

        private void AddtionalValid(ContentModel model)
        {
            if (model.CategoryId != null &&
                (!DbContext.Categories.Any(m => m.Id == model.CategoryId && m.State == 0)))
                ModelState.AddModelError("Categories", Message.InvalidCategoryId);

        }

        public async Task<JObject> Create(ContentModel model)
        {
            AddtionalValid(model);
            if (!ModelState.IsValid)
            {
                return ExtJs.WriterJObject(false, ExtJs.ModelStateToJObject(ModelState));
            }
            var record = new Content()
            {
                Title = model.Title,
                Image = model.Image,
                SortOrder = model.SortOrder,
                Summary = model.Summary,
                State = 0,
                Body = model.Body,
                Created = DateTime.Now,
                Hits = 0,
                CategoryId = model.CategoryId == null || model.CategoryId <= 10000 ? 10000 : model.CategoryId.Value,
                Tags = DbContext.Tags.Where(m => model.Tags.Contains(m.Name)).ToList()
            };
            DbContext.Contents.Add(record);
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true, data: new JObject()
            {
                { "Id" , record.Id},
                { "Hits" , record.Hits},
                { "Created" , record.Created?.ToString(Message.DefaultDatetimeFormat)},
                { "Tags",  string.Join(",",record.Tags.Select(m=>m.Name).ToList())}
            });

        }

        public async Task<JObject> Update(ContentModel model)
        {
            AddtionalValid(model);
            if (!ModelState.IsValid)
            {
                return ExtJs.WriterJObject(false, ExtJs.ModelStateToJObject(ModelState));
            }
            var q = await DbContext.Contents.SingleOrDefaultAsync(m => m.Id == model.Id);
            if (q == null) return ExtJs.WriterJObject(false, msg: string.Format(Message.UpdatedNoExist,Message.Content));
            q.Title = model.Title;
            q.Image = model.Image;
            q.SortOrder = model.SortOrder;
            q.Summary = model.Summary;
            q.Body = model.Body;
            q.CategoryId = model.CategoryId == null || model.CategoryId <= 10000 ? 10000 : model.CategoryId.Value;
            q.Tags.Clear();
            q.Tags = DbContext.Tags.Where(m => model.Tags.Contains(m.Name)).ToList();
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true);
        }

    }
}