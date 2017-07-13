using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using SimpleCMS.Helper;
using SimpleCMS.LocalResources;
using System.Data.Entity;
using SimpleCMS.Models;

namespace SimpleCMS.Controllers
{
    [Authorize]
    public class CategoryController : BaseController
    {
        // GET: Category
        public JObject List(int? node)
        {
            if (node == null || (node <= 10000 && node != 2))
                return ExtJs.WriterJObject(true, data: new JArray());
            var q =
                DbContext.Categories.Include(m=>m.Parent)
                    .OrderBy(m => m.Title)
                    .Where(
                        m =>
                            (node == 2 ? m.HierarchyLevel == 0 : m.ParentId == node) && m.Id != 10000 &&
                            m.State == 0)
                    .Select(m => new
                    {
                        Id = m.Id,
                        Title = m.Title,
                        leaf = m.SubCategories.All(n => n.State != 0),
                        ParentId = m.ParentId,
                        ParentTitle = m.Parent.Title
                    });
            return ExtJs.WriterJObject(true, data: JArray.FromObject(q));
        }

        public async Task<JObject> Delete(int? id)
        {
            if (id == null)
                return ExtJs.WriterJObject(false, msg: string.Format(Message.DeletedNotExist, Message.Category));
            var q = DbContext.Categories.SingleOrDefault(m => m.Id == id && m.State == 0);
            if (q == null) return ExtJs.WriterJObject(false, msg: string.Format(Message.DeletedNotExist, Message.Category));
            if (q.SubCategories.Any()) ExtJs.WriterJObject(false, msg: Message.HasChild);
            foreach (var c in q.Contents)
            {
                c.CategoryId = 10000;
            }
            q.State = 1;
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true, msg: string.Format(MessageList, string.Format(MessageListItem, "pointthree", string.Format(Message.Deleted, Message.Category, q.Title))));
        }

        private void AddtionalValid(CategoryModel model)
        {
            if (model.ParentId != null &&
                (model.ParentId == 10000 || !DbContext.Categories.Any(m => m.Id == model.ParentId && m.State == 0)))
                ModelState.AddModelError("ParentId", Message.InvalidCategoryId);

        }

        public async Task<JObject> Create(CategoryModel model)
        {
            AddtionalValid(model);
            if (!ModelState.IsValid)
            {
                return ExtJs.WriterJObject(false, ExtJs.ModelStateToJObject(ModelState));
            }
            var record = new Category()
            {
                Title = model.Title,
                Image = model.Image,
                ParentId = model.ParentId,
                Content = model.Content,
                Created = DateTime.Now
            };
            DbContext.Categories.Add(record);
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true, data: JObject.FromObject(record));
        }

        public async Task<JObject> Details(int? id)
        {
            if(id == null) return ExtJs.WriterJObject(false, msg: Message.RecordNoExist);
            var q = await DbContext.Categories.SingleOrDefaultAsync(m => m.Id == id && m.State == 0);
            if (q == null) return ExtJs.WriterJObject(false, msg: Message.RecordNoExist);
            return ExtJs.WriterJObject(true, data: new JObject()
            {
                {"Id", q.Id},
                {"Title", q.Title},
                {"ParentId", q.ParentId},
                {"ParentTitle", q.Parent?.Title},
                {"Content", q.Content},
                {"SortOrder", q.SortOrder},
                {"Image", q.Image},
                {"Created", q.Created?.ToString(Message.DefaultDatetimeFormat)}
            });
        }

        public async Task<JObject> Update(CategoryModel model)
        {
            AddtionalValid(model);
            if (model.Id == model.ParentId) ModelState.AddModelError("ParentID", Message.NotSelfToParent);
            if (DbContext.Categories.Include(m => m.Parent).Any(m => m.ParentId == model.Id && m.Id == model.ParentId)) ModelState.AddModelError("ParentId", Message.NotChildToParent);
            if (!ModelState.IsValid)
            {
                return ExtJs.WriterJObject(false, ExtJs.ModelStateToJObject(ModelState));
            }
            var q = await DbContext.Categories.SingleOrDefaultAsync(m => m.Id == model.Id && m.State == 0);
            if (q == null) return ExtJs.WriterJObject(false, msg: Message.UpdatedNoExist);
            q.Title = model.Title;
            q.Content = model.Content;
            q.SortOrder = model.SortOrder;
            q.Image = model.Image;
            q.ParentId = model.ParentId;
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true);
        }

        public async Task<JObject> Select(int? id, string query, int? start ,int? limit)
        {
            var q = DbContext.Categories.Where(m => m.Id != 10000 && m.State == 0);
            var filterNode = $".{id}.";
            if (id != null && id > 10000) q = q.Where(m => !m.FullPath.Contains(filterNode));
            if (!string.IsNullOrEmpty(query)) q = q.Where(m => m.Title.Contains(query));
            var total = await q.CountAsync();
            if (total == 0) return ExtJs.WriterJObject(true, total: 0);
            q = ExtJs.Pagination(start ?? 0, limit ?? 0, total, q.OrderBy(m => m.Title));
            return q == null
                ? ExtJs.WriterJObject(false, total: total)
                : ExtJs.WriterJObject(true, total: total, data: JArray.FromObject(q.Select(m => new
                {
                    Id = m.Id,
                    Title = m.Title
                })));
        }

    }
}