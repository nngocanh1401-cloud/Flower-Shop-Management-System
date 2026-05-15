using FSHOP.Common.DTO.BanHang;
using FSHOP.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FSHOP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class VoucherController : ControllerBase
    {
        private readonly FshopContext _ctx;

        public VoucherController(FshopContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _ctx.Vouchers.ToListAsync();
            return Ok(result);
        }
        // them voucher moi
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] VoucherDTO dto)
        {
            if (await _ctx.Vouchers.AnyAsync(x => x.MaVoucher == dto.MaVoucher))
                return BadRequest(new { message = "Mã voucher đã tồn tại" });

            var voucher = new Voucher
            {
                MaVoucher = dto.MaVoucher,
                TenVoucher = dto.TenVoucher,
                NgayBd = dto.NgayBd,
                NgayKt = dto.NgayKt,
                GiaTriGiam = dto.GiaTriGiam,
                LoaiGiam = dto.LoaiGiam,
                DieuKienApDung = dto.DieuKienApDung,
                SoLuong = dto.SoLuong,
                SoLuongDaDung = 0
            };

            _ctx.Vouchers.Add(voucher);
            await _ctx.SaveChangesAsync();

            return Ok(new { message = "Thêm voucher thành công" });
        }
        // xoa voucher
        [HttpDelete("{maVoucher}")]
        public async Task<IActionResult> Delete(string maVoucher)
        {
            var voucher = await _ctx.Vouchers.FindAsync(maVoucher);

            if (voucher == null)
                return NotFound(new { message = "Không tìm thấy voucher" });

            var daDuocDung = await _ctx.DonHangs.AnyAsync(dh => dh.MaVoucher == maVoucher);

            if (daDuocDung)
                return BadRequest(new
                {
                    message = "Không thể xóa voucher vì đã được sử dụng trong đơn hàng"
                });

            _ctx.Vouchers.Remove(voucher);
            await _ctx.SaveChangesAsync();

            return Ok(new { message = "Xóa voucher thành công" });
        }
    }
}


