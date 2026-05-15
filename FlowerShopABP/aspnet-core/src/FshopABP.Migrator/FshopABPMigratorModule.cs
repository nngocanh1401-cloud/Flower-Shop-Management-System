using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using FshopABP.Configuration;
using FshopABP.EntityFrameworkCore;
using FshopABP.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace FshopABP.Migrator;

[DependsOn(typeof(FshopABPEntityFrameworkModule))]
public class FshopABPMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public FshopABPMigratorModule(FshopABPEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(FshopABPMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            FshopABPConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(FshopABPMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
