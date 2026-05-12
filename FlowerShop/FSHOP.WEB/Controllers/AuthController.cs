using FSHOP.BLL;
using FSHOP.Common.DTOs.HeThong;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace FSHOP.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        /// <summary>Đăng nhập — trả về JWT token</summary>
        [HttpPost("dangnhap")]
        [AllowAnonymous]
        public async Task<IActionResult> DangNhap([FromBody] LoginRequestDTO dto)
        {
            // Gọi service xử lý đăng nhập
            var result = await _authService.DangNhapAsync(dto.TenDangNhap, dto.MatKhau);

            if (result == null)
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });

            return Ok(result);
        }

        /// <summary>Đăng ký tài khoản khách hàng mới</summary>
        [HttpPost("dangky")]
        [AllowAnonymous]
        public async Task<IActionResult> DangKy([FromBody] DangKyDTO dto)
        {
            try
            {
                await _authService.DangKyAsync(dto);
                return Ok(new { message = "Đăng ký thành công" });
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu tên đăng nhập đã tồn tại hoặc lỗi DB
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Đổi mật khẩu — yêu cầu đăng nhập</summary>
        [HttpPut("doimatkhau")]
        [Authorize] // Yêu cầu có Token hợp lệ
        public async Task<IActionResult> DoiMatKhau([FromBody] DoiMatKhauDTO dto)
        {
            // Lấy mã người dùng (MaNguoiDung) từ Claims của JWT token
            var maNguoiDung = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(maNguoiDung))
                return Unauthorized();

            try
            {
                var success = await _authService.DoiMatKhauAsync(maNguoiDung, dto.MatKhauCu, dto.MatKhauMoi);
                if (!success) return NotFound(new { message = "Không tìm thấy người dùng" });

                return Ok(new { message = "Đổi mật khẩu thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}