using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SimpleCMS.Startup))]
namespace SimpleCMS
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
