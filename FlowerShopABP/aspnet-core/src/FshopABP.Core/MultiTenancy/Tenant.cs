using Abp.MultiTenancy;
using FshopABP.Authorization.Users;

namespace FshopABP.MultiTenancy;

public class Tenant : AbpTenant<User>
{
    public Tenant()
    {
    }

    public Tenant(string tenancyName, string name)
        : base(tenancyName, name)
    {
    }
}
