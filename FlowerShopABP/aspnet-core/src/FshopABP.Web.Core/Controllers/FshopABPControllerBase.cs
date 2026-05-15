using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace FshopABP.Controllers
{
    public abstract class FshopABPControllerBase : AbpController
    {
        protected FshopABPControllerBase()
        {
            LocalizationSourceName = FshopABPConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
