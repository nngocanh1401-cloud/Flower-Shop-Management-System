using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace FshopABP.EntityFrameworkCore;

public static class FshopABPDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<FshopABPDbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<FshopABPDbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}
