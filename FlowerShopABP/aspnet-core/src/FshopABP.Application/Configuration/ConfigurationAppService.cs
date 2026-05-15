using Abp.Authorization;
using Abp.Runtime.Session;
using FshopABP.Configuration.Dto;
using System.Threading.Tasks;

namespace FshopABP.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : FshopABPAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
