using Microsoft.OpenApi.Models;
using FSHOP.BLL;
using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using FSHOP.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =========== 1. CHUẨN BỊ DỊCH VỤ (Tất cả builder.Services đặt ở đây) ===========

var connStr = builder.Configuration.GetConnectionString("FShopDB")
    ?? throw new Exception("Không tìm thấy connection string FShopDB");

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
builder.Services.AddScoped<IPhieuNhapHangRepository, PhieuNhapHangRepository>();

builder.Services.AddScoped<PhieuNhapHangService>();
builder.Services.AddScoped<BaoCaoService>();
builder.Services.AddScoped<SanPhamService>();
builder.Services.AddScoped<DonHangService>();
builder.Services.AddScoped<AuthService>();

// --- Cấu hình JWT Authentication ---
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
        ),

        RoleClaimType = System.Security.Claims.ClaimTypes.Role
    };
});

builder.Services.AddAuthorization();


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

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập Token theo định dạng: Bearer {your_token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});


// =========== 2. CHỐT BUILD ===========
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Địa chỉ Angular của bạn
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- Middleware thứ tự quan trọng ---

app.UseCors("AllowAngular"); // Nếu dùng CORS
app.UseAuthentication(); // 1. Xác thực (Ai đang vào?)
app.UseAuthorization();  // 2. Phân quyền (Họ được làm gì?)
app.MapControllers();

app.Run();