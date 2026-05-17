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
                                     nguoiDung.MaVaiTroNavigation?.TenVaiTro ?? "User",
                                     nguoiDung.MaKh);

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

            // Tạo mã người dùng mới
            var maMoi = await TaoMaNguoiDungMoiAsync();
            var hashPW = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau);

            // Gọi Stored Procedure sp_DangKy
            await _ctx.Database.ExecuteSqlRawAsync(
                "EXEC sp_DangKy @MaNguoiDung={0}, @TenDangNhap={1}, @MatKhauHash={2}, @TenKH={3}, @SDT={4}, @DiaChi={5}",
                maMoi, dto.TenDangNhap, hashPW, dto.TenKH, dto.SDT, dto.DiaChi ?? "");

            return true;
        }
        // tao ma nguoi dung k trung
        private async Task<string> TaoMaNguoiDungMoiAsync()
        {
            string maMoi;

            do
            {
                // ND + MMddHHmm = 10 ký tự
                maMoi = "KH" + DateTime.Now.ToString("MMddHHmm");

                if (await _ctx.NguoiDungs.AnyAsync(x => x.MaNguoiDung == maMoi) ||
                    await _ctx.KhachHangs.AnyAsync(x => x.MaKh == maMoi))
                {
                    await Task.Delay(1000);
                }

            } while (await _ctx.NguoiDungs.AnyAsync(x => x.MaNguoiDung == maMoi) ||
                     await _ctx.KhachHangs.AnyAsync(x => x.MaKh == maMoi));

            return maMoi;
        }

        //  Đổi mật khẩu 
        public async Task<bool> DoiMatKhauAsync(string maNguoiDung, string matKhauCu, string matKhauMoi)
        {
            var nd = await _ctx.NguoiDungs.FindAsync(maNguoiDung);
            if (nd == null) return false;

            if (!BCrypt.Net.BCrypt.Verify(matKhauCu, nd.MatKhauHash))
                throw new Exception("Mật khẩu cũ không đúng");

            if (BCrypt.Net.BCrypt.Verify(matKhauMoi, nd.MatKhauHash))
                throw new Exception("Mật khẩu mới không được trùng với mật khẩu cũ");

            nd.MatKhauHash = BCrypt.Net.BCrypt.HashPassword(matKhauMoi);
            await _ctx.SaveChangesAsync();
            return true;
        }
        //  Tạo JWT Token 
        private string TaoJwtToken(string maNguoiDung, string tenDangNhap, string vaiTro, string? maKH)
        {
            var jwtKey = _cfg["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
                throw new Exception("JWT Key chưa được cấu hình.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            if (!double.TryParse(_cfg["Jwt:ExpireHours"], out double expireHours))
                expireHours = 24;

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, maNguoiDung),
        new Claim(ClaimTypes.Name, tenDangNhap),
        new Claim(ClaimTypes.Role, vaiTro)
    };

            if (!string.IsNullOrWhiteSpace(maKH))
                claims.Add(new Claim("MaKH", maKH));

            var token = new JwtSecurityToken(
                issuer: _cfg["Jwt:Issuer"],
                audience: _cfg["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(expireHours),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
