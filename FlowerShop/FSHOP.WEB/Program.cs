using Microsoft.OpenApi.Models;
using FSHOP.BLL;
using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using FSHOP.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using System;


var builder = WebApplication.CreateBuilder(args);

// =========== 1. CHUẨN BỊ DỊCH VỤ (Tất cả builder.Services đặt ở đây) ===========

var connStr = builder.Configuration.GetConnectionString("FShopDB");

//LAY CHUOI KET NOI CHO ENTITY FRAMWORK (FShopContext)
builder.Services.AddDbContext<FshopContext>(options =>
    options.UseSqlServer(connStr));

builder.Services.AddScoped<ISanPhamRepository, SanPhamRepository>();
builder.Services.AddScoped<IDanhMucRepository, DanhMucRepository>();

// ADO.NET — truyền connection string
builder.Services.AddScoped<INhaCungCapRepository>(
    provider => new NhaCungCapRepository(connStr));

builder.Services.AddScoped<IDonHangRepository, DonHangRepository>();

builder.Services.AddScoped<IBaoCaoRepository, BaoCaoRepository>();

builder.Services.AddScoped<BaoCaoService>();
builder.Services.AddScoped<SanPhamService>();
builder.Services.AddScoped<DonHangService>();


// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FlowerShop API",
        Version = "v1"
    });
});

//// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();

// =========== 2. CHỐT BUILD ===========
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();