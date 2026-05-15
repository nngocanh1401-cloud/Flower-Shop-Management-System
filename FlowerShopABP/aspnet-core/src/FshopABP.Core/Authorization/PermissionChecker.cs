using Abp.Authorization;
using FshopABP.Authorization.Roles;
using FshopABP.Authorization.Users;

namespace FshopABP.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
