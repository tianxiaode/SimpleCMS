using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using MimeDetective.Extensions;
using Newtonsoft.Json.Linq;
using SimpleCMS.Helper;
using SimpleCMS.LocalResources;
using SimpleCMS.Models;

namespace SimpleCMS.Controllers
{
    [Authorize]
    public class MediaController : BaseController
    {
        // GET: Media
        public async Task<JObject> Create()
        {
            var allowImageFileType = AppSettings.GetSettingAsString("allowImageFileType");
            var allowAudioFileType = AppSettings.GetSettingAsString("allowAudioFileType");
            var allowVideoFileType = AppSettings.GetSettingAsString("allowVideoFileType");
            var file = Request.Files["file"];
            if (file == null) return ExtJs.WriterJObject(false, msg: Message.NoFileUpload);
            var fileType = file.InputStream.GetFileType();
            var ext = fileType?.Extension;
            MediaType? type = null;
            if (allowImageFileType.IndexOf($",{ext},", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                type = MediaType.Image;

            }
            else if (allowAudioFileType.IndexOf($",{ext},", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                type = MediaType.Audio;
            }
            else if (allowVideoFileType.IndexOf($",{ext},", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                type = MediaType.Video;
            }
            if (type == null) return ExtJs.WriterJObject(false, msg: Message.FileTypeNotAllow + ext);

            var size = AppSettings.GetSettingAsInteger("allowUploadSize") ?? 10485760;
            if (file.ContentLength == 0 || file.ContentLength > size) return ExtJs.WriterJObject(false, msg: Message.FileSizeNotAllow);

            var guid = Guid.NewGuid();
            ShortGuid sguid = guid;
            var filename = sguid.ToString();
            var path = $"{filename.Substring(0, 2)}/{filename.Substring(2, 2)}";
            var dir = Server.MapPath($"~/upload/{path}");
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            file.SaveAs($"{dir}\\{filename}.{ext}");

            var media = new Media()
            {
                Filename = $"{filename}.{ext}",
                Description = file.FileName,
                Size = file.ContentLength,
                Path = path,
                Type = (byte)type,
                Uploaded = DateTime.Now
            };
            DbContext.Mediae.Add(media);
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true, data: new JObject()
            {
                { "Id", media.Id },
                { "FileName" , media.Filename},
                { "Description" , media.Description},
                { "Size" , media.Size},
                { "Path" , media.Path },
                { "Type" ,media.Type },
                { "Uploaded",  media.Uploaded?.ToString(Message.DefaultDatetimeFormat)}

            });

        }

        private readonly JObject _allowSorts = new JObject()
        {
            { "Uploaded", "Uploaded" },
            { "Size", "Size" },
            { "Description", "Description" }
        };

        // GET: Media
        public async Task<JObject> List(string sort , int? start , int? limit, int[] type,int? year, int? month, int? day, string query)
        {
            if (type == null) return ExtJs.WriterJObject(true, total: 0);
            var q = DbContext.Mediae.Where(m=>type.Contains(m.Type));
            if (year != null && month !=null)
            {
                q = q.Where(m => m.Uploaded.Value.Year == year && m.Uploaded.Value.Month == month);
            }
            if (day !=null)
            {
                q = q.Where(m => m.Uploaded.Value.Day == day);
            }
            if (!string.IsNullOrEmpty(query)) q = q.Where(m => m.Description.Contains(query));
            var total = await q.CountAsync();
            if (total == 0) return ExtJs.WriterJObject(true, total: 0);
            q = ExtJs.OrderBy(sort, _allowSorts, q);
            q = ExtJs.Pagination(start ?? 0, limit ?? 0, total, q);
            var ja = new JArray();
            if (q == null) return ExtJs.WriterJObject(false, total: total);
            foreach (var media in q)
            {
                ja.Add(new JObject()
                {
                    { "Id", media.Id },
                    { "FileName" , media.Filename},
                    { "Description" , media.Description},
                    { "Size" , media.Size},
                    { "Path" , media.Path },
                    { "Type" ,media.Type },
                    { "Uploaded",  media.Uploaded?.ToString(Message.DefaultDatetimeFormat)}
                });
            }
            return ExtJs.WriterJObject(true, total: total, data: ja);
        }

        public async Task<JObject> Delete(int[] id)
        {
            if(id == null) return ExtJs.WriterJObject(false, msg: Message.DeletedNotExist);
            var q = DbContext.Mediae.Where(m => id.Contains(m.Id));
            if (!await q.AnyAsync()) return ExtJs.WriterJObject(false, msg: Message.DeletedNotExist);
            var msgList = new List<string>();
            foreach (var c in q)
            {
                var file = new FileInfo(Server.MapPath($"~/upload/{c.Path}/{c.Filename}"));
                if (file.Exists) file.Delete();
                DbContext.Mediae.Remove(c);
                msgList.Add(string.Format(MessageListItem, "pointthree", string.Format(Message.Deleted, Message.Media, c.Description)));
            }
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true, msg: string.Format(MessageList, string.Join("", msgList)));
        }

        public JObject DateList()
        {
            var q = from m in DbContext.Mediae
                let year = m.Uploaded.Value.Year
                let month = m.Uploaded.Value.Month
                group m by new { year, month }
                into g
                orderby g.Key.year descending, g.Key.month descending
                select new { year = g.Key.year, month = g.Key.month };
            var ja = new JArray()
            {
                new JObject() { {"Id", "all"}, { "Text", "全部" } },
                new JObject() { {"Id", "today"}, { "Text", "今天" } },
            };
            foreach (var c in q)
            {

                ja.Add(new JObject()
                {
                    {"Id", $"{c.year},{c.month}"}, { "Text", $"{c.year}年{c.month}月"}
                });
            }
            return ExtJs.WriterJObject(true, data: ja);
        }

        public async Task<JObject> Update(int? id, string value)
        {
            if (string.IsNullOrEmpty(value) || value.Length > 255) return ExtJs.WriterJObject(false, msg: Message.Invalid);
            var q = DbContext.Mediae.SingleOrDefault(m => m.Id == id);
            if (q == null) return ExtJs.WriterJObject(false, msg: string.Format(Message.UpdatedNoExist, Message.Media));
            q.Description = value;
            await DbContext.SaveChangesAsync();
            return ExtJs.WriterJObject(true);
        }


    }
}