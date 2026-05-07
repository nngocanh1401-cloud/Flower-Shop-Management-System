using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using FSHOP.DAL.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// =========== 1. CHUẨN BỊ DỊCH VỤ (Tất cả builder.Services đặt ở đây) ===========
var connStr = builder.Configuration.GetConnectionString("FShopDB");
//LAY CHUOI KET NOI CHO ENTITY FRAMWORK (FShopContext)
builder.Services.AddDbContext<FshopContext>(options =>
    options.UseSqlServer(connStr));

// ADO.NET — truyền connection string
builder.Services.AddScoped<INhaCungCapRepository>(
    provider => new NhaCungCapRepository(connStr));

// =========== 2. CHỐT BUILD ===========
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();