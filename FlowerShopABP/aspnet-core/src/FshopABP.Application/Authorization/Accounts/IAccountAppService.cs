using Abp.Application.Services;
using FshopABP.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace FshopABP.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
