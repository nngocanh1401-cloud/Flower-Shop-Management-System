using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FSHOP.BLL;

namespace FSHOP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly SanPhamService _service;

        public SanPhamController(SanPhamService service)
        {
            _service = service;
        }

        [HttpGet("tim-kiem")]
        public IActionResult TimKiem(string keyword)
        {
            var result = _service.TimKiemSanPham(keyword);
            return Ok(result);
        }

        //https://localhost:xxxx/api/sanpham/tim-kiem?keyword=hoa

        [HttpGet("loc-gia")]
        public IActionResult LocGia(decimal min, decimal max)
        {
            var result = _service.LocGia(min, max);
            return Ok(result);
        //https://localhost:xxxx/api/sanpham/loc-gia?min=10000&max=50000
        }

    }
}
