using FSHOP.BLL;
using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using FSHOP.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<ISanPhamRepository, SanPhamRepository>();

builder.Services.AddDbContext<FshopContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<IBaoCaoRepository, BaoCaoRepository>();
builder.Services.AddScoped<BaoCaoService>();

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

