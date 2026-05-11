using Microsoft.AspNetCore.Mvc;
using FSHOP.BLL;

namespace FSHOP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaoCaoController: ControllerBase
    {
        private readonly BaoCaoService _service;

        public BaoCaoController(BaoCaoService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetBaoCao()
        {
            var data = _service.LayBaoCaoSanPham();
            return Ok(data);
        }
        // GET api/baocao/doanhthu
        [HttpGet("doanhthu")]
        public IActionResult DoanhThu()
        {
            var data = _service.LayDoanhThu();

            return Ok(data);
        }

        // GET api/baocao/tonkho
        [HttpGet("tonkho")]
        public IActionResult TonKho()
        {
            var data = _service.LayBaoCaoTonKho();

            return Ok(data);
        }
        // GET api/baocao/top10
        [HttpGet("top10")]
        public IActionResult GetTop10()
        {
            var data = _service.LayTop10();
            return Ok(data);
        }
    }
}
