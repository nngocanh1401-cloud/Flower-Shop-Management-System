using Abp.Zero.EntityFrameworkCore;
using FshopABP.Authorization.Roles;
using FshopABP.Authorization.Users;
using FshopABP.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace FshopABP.EntityFrameworkCore;

public class FshopABPDbContext : AbpZeroDbContext<Tenant, Role, User, FshopABPDbContext>
{
    /* Define a DbSet for each entity of the application */

    public FshopABPDbContext(DbContextOptions<FshopABPDbContext> options)
        : base(options)
    {
    }
}
