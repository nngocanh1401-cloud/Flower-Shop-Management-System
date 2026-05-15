using Abp.Modules;
using Abp.Reflection.Extensions;
using FshopABP.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace FshopABP.Web.Host.Startup
{
    [DependsOn(
       typeof(FshopABPWebCoreModule))]
    public class FshopABPWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public FshopABPWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(FshopABPWebHostModule).GetAssembly());
        }
    }
}
