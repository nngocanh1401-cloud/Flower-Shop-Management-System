using Abp.Application.Services;
using FshopABP.MultiTenancy.Dto;

namespace FshopABP.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

