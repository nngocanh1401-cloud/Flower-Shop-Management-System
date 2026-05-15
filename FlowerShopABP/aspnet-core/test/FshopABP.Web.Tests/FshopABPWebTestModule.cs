using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using FshopABP.EntityFrameworkCore;
using FshopABP.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace FshopABP.Web.Tests;

[DependsOn(
    typeof(FshopABPWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class FshopABPWebTestModule : AbpModule
{
    public FshopABPWebTestModule(FshopABPEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(FshopABPWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(FshopABPWebMvcModule).Assembly);
    }
}