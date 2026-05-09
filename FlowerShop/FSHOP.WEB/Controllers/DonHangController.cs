using FSHOP.BLL;
using FSHOP.DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FSHOP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonHangController : ControllerBase
    {
        private readonly DonHangService _service;

        public DonHangController(DonHangService service)
        {
            _service = service;
        }

        // POST api/donhang
        [HttpPost]
        public IActionResult Create(DonHang donHang)
        {
            _service.TaoDonHang(donHang);

            return Ok(new
            {
                message = "Tạo đơn hàng thành công"
            });
        }
        // PUT api/donhang/1/trangthai
        [HttpPut("{id}/trangthai")]
        public IActionResult UpdateTrangThai(int id, string trangThai)
        {
            _service.CapNhatTrangThai(id, trangThai);

            return Ok(new
            {
                message = "Cập nhật trạng thái thành công"
            });
        }

    }
}
