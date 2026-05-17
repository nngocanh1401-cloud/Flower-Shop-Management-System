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

        //báo cáo sản phẩm
        public List<VwBaoCaoSanPham> LayBaoCaoSanPham()
        {
            return _baoCaoRepo.GetBaoCao();
        }

        //Báo cáo doanh thu theo tháng, năm
        public List<VwDoanhThuTheoThang> LayDoanhThu(int? nam, int? thang)
        {
            return _baoCaoRepo.LayDoanhThu(nam, thang);
        }

        // Báo cáo tồn kho
        public List<VwTonKhoSanPham> LayBaoCaoTonKho()
        {
            return _baoCaoRepo.GetTonKho();
        }

        // Báo cáo Top 10 sản phẩm
        public List<VwTopSanPhamBanChay> LayTop10()
        {
            return _baoCaoRepo.GetTopBanChay();
        }
    }
}
