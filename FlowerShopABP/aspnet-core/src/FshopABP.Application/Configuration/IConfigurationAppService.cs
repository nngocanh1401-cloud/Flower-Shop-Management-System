using FshopABP.Configuration.Dto;
using System.Threading.Tasks;

namespace FshopABP.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
