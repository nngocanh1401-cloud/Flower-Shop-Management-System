using Abp.Application.Services;
using FshopABP.Sessions.Dto;
using System.Threading.Tasks;

namespace FshopABP.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
