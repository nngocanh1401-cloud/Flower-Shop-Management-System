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
    }
}
