using FSHOP.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FSHOP.Common.DTO.BanHang;


namespace FSHOP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhachHangController : ControllerBase
    {
        private readonly FshopContext _ctx;

        public KhachHangController(FshopContext ctx)
        {
            _ctx = ctx;
        }
        // kiem tra so dien thoai de biet co la khach hang chua truoc khi tao don
        [HttpGet("tim-sdt")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> TimTheoSdt(string sdt)
        {
            var kh = await _ctx.KhachHangs
                .FirstOrDefaultAsync(x => x.Sdt == sdt);

            if (kh == null)
                return NotFound(new { message = "Không tìm thấy khách hàng" });

            return Ok(new
            {
                maKH = kh.MaKh,
                tenKH = kh.TenKh,
                sdt = kh.Sdt,
                diaChi = kh.DiaChi
            });
        }
        // admin tao don hang cho khach hang
        [HttpPost("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> TaoKhachHang([FromBody] KhachHangDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.SDT) || !dto.SDT.StartsWith("0"))
                return BadRequest(new { message = "Số điện thoại phải bắt đầu bằng số 0" });

            var daTonTai = await _ctx.KhachHangs.AnyAsync(x => x.Sdt == dto.SDT);
            if (daTonTai)
                return BadRequest(new { message = "Số điện thoại đã tồn tại trong hệ thống" });

            var maKH = await TaoMaKhachHangMoiAsync();

            var kh = new KhachHang
            {
                MaKh = maKH,
                TenKh = dto.TenKH,
                Sdt = dto.SDT,
                DiaChi = dto.DiaChi
            };

            _ctx.KhachHangs.Add(kh);
            await _ctx.SaveChangesAsync();

            return Ok(new
            {
                message = "Thêm khách hàng thành công",
                maKH = maKH
            });
        }

        private async Task<string> TaoMaKhachHangMoiAsync()
        {
            string maKH;

            do
            {
                maKH = "KH" + DateTime.Now.ToString("MMddHHmm");

                if (await _ctx.KhachHangs.AnyAsync(x => x.MaKh == maKH))
                    await Task.Delay(1000);

            } while (await _ctx.KhachHangs.AnyAsync(x => x.MaKh == maKH));

            return maKH;
        }
        // lay danh sach khach hang
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _ctx.KhachHangs
                .Select(kh => new
                {
                    maKH = kh.MaKh,
                    tenKH = kh.TenKh,
                    sdt = kh.Sdt,
                    diaChi = kh.DiaChi
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var kh = await _ctx.KhachHangs.FindAsync(id);

            if (kh == null)
                return NotFound(new { message = "Không tìm thấy khách hàng" });

            // Kiểm tra khách hàng đã có đơn hàng hay chưa
            bool daCoDonHang = await _ctx.DonHangs.AnyAsync(d => d.MaKh == id);

            if (daCoDonHang)
                return BadRequest(new
                {
                    message = "Không thể xóa khách hàng vì khách hàng đã có đơn hàng"
                });

            _ctx.KhachHangs.Remove(kh);
            await _ctx.SaveChangesAsync();

            return Ok(new
            {
                message = "Xóa khách hàng thành công"
            });
        }


    }
}

