using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.BLL
{
    public class SanPhamService
    {
        private readonly ISanPhamRepository _sanPhamrepo;

        public SanPhamService(ISanPhamRepository sanPhamrepo)
        {
            _sanPhamrepo = sanPhamrepo;
        }
        // =========================
        // LẤY DANH SÁCH SẢN PHẨM
        // =========================
        public IEnumerable<SanPham> GetAllSanPham()
        {
            // GỌI DAL
            return _sanPhamrepo.GetAll();
        }
        // =========================
        // VALIDATE + THÊM LOGIC
        // =========================
        public string KiemTraSanPham(SanPham sp)
        {
            if (string.IsNullOrEmpty(sp.TenSp))
                return "Tên sản phẩm không được rỗng";

            if (sp.DonGia <= 0)
                return "Giá phải > 0";

            return "OK";
        }

        public List<SanPham> TimKiemSanPham(string keyword)
        {
            // 1. GỌI DAL
            var list = _sanPhamrepo.GetAll();

            // 2. XỬ LÝ LINQ (BLL)
            return list.Where(x => x.TenSp != null &&
            x.TenSp.ToLower().Contains(keyword.ToLower())).ToList();
        }
        public List<SanPham> LocGia(decimal min, decimal max)
        {
            var list = _sanPhamrepo.GetAll();

            return list.Where(x => x.DonGia >= min && x.DonGia <= max).ToList();
        }
        public SanPham GetById(string id)
        {
            return _sanPhamrepo.GetById(id);
        }

    }
}
