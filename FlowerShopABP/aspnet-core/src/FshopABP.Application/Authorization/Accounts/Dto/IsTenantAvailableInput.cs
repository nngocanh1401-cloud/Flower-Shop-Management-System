using Abp.MultiTenancy;
using System.ComponentModel.DataAnnotations;

namespace FshopABP.Authorization.Accounts.Dto;

public class IsTenantAvailableInput
{
    [Required]
    [StringLength(AbpTenantBase.MaxTenancyNameLength)]
    public string TenancyName { get; set; }
}
