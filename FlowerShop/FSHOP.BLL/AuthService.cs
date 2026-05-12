using FSHOP.DAL.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using FSHOP.Common.DTOs.HeThong;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;


namespace FSHOP.BLL
{
    public class AuthService
    {
        private readonly FshopContext _ctx;
        private readonly IConfiguration _cfg;

        public AuthService(FshopContext ctx, IConfiguration cfg)
        {
            _ctx = ctx;
            _cfg = cfg;
        }


        //  Đăng nhập 
        public async Task<LoginResponseDTO?> DangNhapAsync(string tenDangNhap, string matKhau)
        {
            // Lưu ý: Đảm bảo bảng NguoiDung có navigation property MaVaiTroNavigation
            var nguoiDung = await _ctx.NguoiDungs
                .Include(nd => nd.MaVaiTroNavigation)
                .FirstOrDefaultAsync(nd => nd.TenDangNhap == tenDangNhap);

            if (nguoiDung == null) return null;


            // Kiểm tra mật khẩu (Sử dụng BCrypt)
            if (!BCrypt.Net.BCrypt.Verify(matKhau, nguoiDung.MatKhauHash))
                return null;

            // Tạo JWT token
            var token = TaoJwtToken(nguoiDung.MaNguoiDung,
                                     nguoiDung.TenDangNhap,
                                     nguoiDung.MaVaiTroNavigation?.TenVaiTro ?? "User");

            return new LoginResponseDTO
            {
                Token = token,
                TenDangNhap = nguoiDung.TenDangNhap,
                VaiTro = nguoiDung.MaVaiTroNavigation?.TenVaiTro,
                MaKH = nguoiDung.MaKh // Liên kết với bảng KhachHang nếu có
            };
        }

        //  Đăng ký 
        public async Task<bool> DangKyAsync(DangKyDTO dto)
        {
            // Kiểm tra tên đăng nhập đã tồn tại chưa
            if (await _ctx.NguoiDungs.AnyAsync(nd => nd.TenDangNhap == dto.TenDangNhap))
                throw new Exception("Tên đăng nhập đã tồn tại");

            // Tạo mã người dùng mới dựa trên logic của bạn (ví dụ: ND + chuỗi thời gian)
            var maMoi = "ND" + DateTime.Now.ToString("yyMMddHHss");
            var hashPW = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau);

            // Gọi Stored Procedure sp_DangKy (Thành viên B làm trong Tuần 1)
            await _ctx.Database.ExecuteSqlRawAsync(
                "EXEC sp_DangKy @MaNguoiDung={0}, @TenDangNhap={1}, @MatKhauHash={2}, @TenKH={3}, @SDT={4}, @DiaChi={5}",
                maMoi, dto.TenDangNhap, hashPW, dto.TenKH, dto.SDT, dto.DiaChi ?? "");

            return true;
        }

        //  Đổi mật khẩu 
        public async Task<bool> DoiMatKhauAsync(string maNguoiDung, string matKhauCu, string matKhauMoi)
        {
            var nd = await _ctx.NguoiDungs.FindAsync(maNguoiDung);
            if (nd == null) return false;

            if (!BCrypt.Net.BCrypt.Verify(matKhauCu, nd.MatKhauHash))
                throw new Exception("Mật khẩu cũ không đúng");

            nd.MatKhauHash = BCrypt.Net.BCrypt.HashPassword(matKhauMoi);
            await _ctx.SaveChangesAsync();
            return true;
        }

        //  Tạo JWT Token 
        private string TaoJwtToken(string maNguoiDung, string tenDangNhap, string vaiTro)
        {
            var jwtKey = _cfg["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey)) throw new Exception("JWT Key chưa được cấu hình.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Lấy thời gian hết hạn từ cấu hình, mặc định 24h nếu lỗi
            if (!double.TryParse(_cfg["Jwt:ExpireHours"], out double expireHours))
                expireHours = 24;

            var expire = DateTime.Now.AddHours(expireHours);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, maNguoiDung),
                new Claim(ClaimTypes.Name, tenDangNhap),
                new Claim(ClaimTypes.Role, vaiTro)
            };

            var token = new JwtSecurityToken(
                issuer: _cfg["Jwt:Issuer"],
                audience: _cfg["Jwt:Audience"],
                claims: claims,
                expires: expire,
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
