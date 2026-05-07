using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FSHOP.DAL;
using FSHOP.DAL.Models;
using FSHOP.DAL.Interfaces;

namespace FSHOP.BLL
{
    public class BaoCaoService
    {
        private readonly IBaoCaoRepository _baoCaoRepo;

        public BaoCaoService(IBaoCaoRepository baoCaoRepo)
        {
            _baoCaoRepo = baoCaoRepo;
        }

        public List<BaoCaoSanPham> LayBaoCaoSanPham()
        {
            return _baoCaoRepo.GetBaoCao();
        }
    }
}
