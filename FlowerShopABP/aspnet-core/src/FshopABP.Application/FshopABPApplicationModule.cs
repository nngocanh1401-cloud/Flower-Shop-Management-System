using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using FshopABP.Authorization;

namespace FshopABP;

[DependsOn(
    typeof(FshopABPCoreModule),
    typeof(AbpAutoMapperModule))]
public class FshopABPApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<FshopABPAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(FshopABPApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
