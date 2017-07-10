using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;

namespace SimpleCMS.Helper
{
    public class VerifyCode
    {
        #region 验证码长度(默认6个验证码的长度)

        public int Length { get; set; } = 6;

        #endregion

        #region 验证码字体大小(为了显示扭曲效果，默认40像素，可以自行修改)

        public int FontSize { get; set; } = 40;

        #endregion

        #region 边框补(默认1像素)

        public int Padding { get; set; } = 2;

        #endregion

        #region 是否输出燥点(默认不输出)

        public bool Chaos { get; set; } = true;

        #endregion

        #region 输出燥点的颜色(默认灰色)

        public Color ChaosColor { get; set; } = Color.LightGray;

        #endregion

        #region 自定义背景色(默认白色)

        public Color BackgroundColor { get; set; } = Color.White;

        #endregion

        #region 自定义随机颜色数组

        public Color[] Colors { get; set; } = { Color.Black, Color.Red, Color.DarkBlue, Color.Green, Color.Orange, Color.Brown, Color.DarkCyan, Color.Purple };

        #endregion

        #region 自定义字体数组

        public string[] Fonts { get; set; } = { "Arial", "Georgia" };

        #endregion

        #region 自定义随机码字符串序列(使用逗号分隔)

        public string CodeSerial { get; set; } = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";

        #endregion

        #region 产生波形滤镜效果
        private const double Pi = 3.1415926535897932384626433832795;
        private const double Pi2 = 6.283185307179586476925286766559;

        /// <summary>
        /// 正弦曲线Wave扭曲图片（Edit By 51aspx.com）
        /// </summary>
        /// <param name="sourceBitmap">图片路径</param>
        /// <param name="xDir">如果扭曲则选择为True</param>
        /// <param name="multValue">波形的幅度倍数，越大扭曲的程度越高，一般为3</param>
        /// <param name="phase">波形的起始相位，取值区间[0-2*PI)</param>
        /// <returns></returns>
        public System.Drawing.Bitmap TwistImage(Bitmap sourceBitmap, bool xDir, double multValue, double phase)
        {
            var destBmp = new Bitmap(sourceBitmap.Width, sourceBitmap.Height);

            // 将位图背景填充为白色
            var graph = System.Drawing.Graphics.FromImage(destBmp);
            graph.FillRectangle(new SolidBrush(System.Drawing.Color.White), 0, 0, destBmp.Width, destBmp.Height);
            graph.Dispose();

            var dBaseAxisLen = xDir ? (double)destBmp.Height : (double)destBmp.Width;

            for (var i = 0; i < destBmp.Width; i++)
            {
                for (var j = 0; j < destBmp.Height; j++)
                {
                    double dx = 0;
                    dx = xDir ? (Pi2 * (double)j) / dBaseAxisLen : (Pi2 * (double)i) / dBaseAxisLen;
                    dx += phase;
                    var dy = Math.Sin(dx);

                    // 取得当前点的颜色
                    int nOldX = 0, nOldY = 0;
                    nOldX = xDir ? i + (int)(dy * multValue) : i;
                    nOldY = xDir ? j : j + (int)(dy * multValue);

                    var color = sourceBitmap.GetPixel(i, j);
                    if (nOldX >= 0 && nOldX < destBmp.Width
                     && nOldY >= 0 && nOldY < destBmp.Height)
                    {
                        destBmp.SetPixel(nOldX, nOldY, color);
                    }
                }
            }

            return destBmp;
        }
        #endregion

        #region 生成校验码图片
        public Bitmap CreateImageCode(string code)
        {
            var fSize = FontSize;
            var fWidth = fSize + Padding;

            var imageWidth = (int)(code.Length * fWidth) + 4 + Padding * 2;
            var imageHeight = fSize * 2 + Padding;

           var image = new System.Drawing.Bitmap(imageWidth, imageHeight);

            var g = Graphics.FromImage(image);

            g.Clear(BackgroundColor);

            var rand = new Random();

            //给背景添加随机生成的燥点
            if (this.Chaos)
            {

                var pen = new Pen(ChaosColor, 0);
                var c = Length * 10;

                for (var i = 0; i < c; i++)
                {
                    var x = rand.Next(image.Width);
                    var y = rand.Next(image.Height);

                    g.DrawRectangle(pen, x, y, 1, 1);
                }
            }


            var n1 = (imageHeight - FontSize - Padding * 2);
            var n2 = n1 / 4;
            var top1 = n2;
            var top2 = n2 * 2;


            //随机字体和颜色的验证码字符
            for (var i = 0; i < code.Length; i++)
            {
                var cindex = rand.Next(Colors.Length - 1);
                var findex = rand.Next(Fonts.Length - 1);

                var font = new System.Drawing.Font(Fonts[findex], fSize, System.Drawing.FontStyle.Bold);
                var brush = new System.Drawing.SolidBrush(Colors[cindex]);

                var top = i % 2 == 1 ? top2 : top1;

                var left = i * fWidth;

                g.DrawString(code.Substring(i, 1), font, brush, left, top);
            }

            //画一个边框 边框颜色为Color.Gainsboro
            g.DrawRectangle(new Pen(Color.Gainsboro, 0), 0, 0, image.Width - 1, image.Height - 1);
            g.Dispose();

            //产生波形（Add By 51aspx.com）
            image = TwistImage(image, true, 8, 4);

            return image;
        }
        #endregion

        #region 将创建好的图片输出到页面
        public void CreateImageOnPage(string code, HttpContext context)
        {
            var ms = new System.IO.MemoryStream();
            var image = this.CreateImageCode(code);

            image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

            context.Response.ClearContent();
            context.Response.ContentType = "image/Jpeg";
            context.Response.BinaryWrite(ms.GetBuffer());

            ms.Close();
            ms = null;
            image.Dispose();
            image = null;
        }
        #endregion

        #region 将创建好的图片输出到页面
        public byte[] CreateImage(string code)
        {
            var ms = new System.IO.MemoryStream();
            var image = this.CreateImageCode(code);
            try
            {
                image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                return ms.ToArray();
            }
            finally
            {
                ms.Close();
                ms = null;
                image.Dispose();
                image = null;
            }

        }
        #endregion

        #region 生成随机字符码
        public string CreateVerifyCode(int codeLen)
        {
            if (codeLen == 0)
            {
                codeLen = Length;
            }

            var arr = CodeSerial.Split(',');

            var code = "";


            var rand = new Random(unchecked((int)DateTime.Now.Ticks));

            for (var i = 0; i < codeLen; i++)
            {
                var randValue = rand.Next(0, arr.Length - 1);

                code += arr[randValue];
            }

            return code;
        }

        public string CreateVerifyCode()
        {
            return CreateVerifyCode(0);
        }
        #endregion
    }
}