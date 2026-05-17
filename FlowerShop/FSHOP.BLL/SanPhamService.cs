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
        private readonly IDanhMucRepository _danhMucRepo;

        public SanPhamService(ISanPhamRepository sanPhamrepo, IDanhMucRepository danhMucRepo)
        {
            _sanPhamrepo = sanPhamrepo;
            _danhMucRepo = danhMucRepo;
        }
        
        //Tạo sản phẩm
        public string TaoSanPham(SanPham sp)
        {
            var validateResult = KiemTraSanPham(sp);

            if (validateResult != "OK")
                return validateResult;

            if (_sanPhamrepo.GetById(sp.MaSp) != null)
                return "Mã sản phẩm đã tồn tại";

            try
            {
                _sanPhamrepo.Add(sp);
                _sanPhamrepo.Save();

                return "Thêm sản phẩm thành công";
            }
            catch
            {
                return "Không thể thêm sản phẩm";
            }
        }

        public IEnumerable<SanPham> GetAllSanPham()
        {
            // Gọi DAL
            return _sanPhamrepo.GetAll();
        }
        //Validate 
        public string KiemTraSanPham(SanPham sp)
        {
            if (sp == null)
                return "Dữ liệu sản phẩm không hợp lệ";

            if (string.IsNullOrWhiteSpace(sp.MaSp))
                return "Mã sản phẩm không được rỗng";

            if (string.IsNullOrWhiteSpace(sp.TenSp))
                return "Tên sản phẩm không được rỗng";

            if (sp.DonGia <= 0)
                return "Giá phải > 0";

            if (sp.SoLuongTon < 0)
                return "Số lượng tồn không được âm";

            if (!string.IsNullOrWhiteSpace(sp.MaDm) && _danhMucRepo.GetById(sp.MaDm) == null)
                return "Mã danh mục không tồn tại";

            return "OK";
        }

        public List<SanPham> TimKiemSanPham(string keyword)
        {
            var list = _sanPhamrepo.GetAll();

            // Xử lý LinQ
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

        public string CapNhatSanPham(string id, SanPham sp)
        {
            var sanPhamHienTai = _sanPhamrepo.GetById(id);

            if (sanPhamHienTai == null)
                return "Không tìm thấy sản phẩm";

            sanPhamHienTai.TenSp = sp.TenSp;
            sanPhamHienTai.DonGia = sp.DonGia;
            sanPhamHienTai.SoLuongTon = sp.SoLuongTon;
            sanPhamHienTai.MaDm = sp.MaDm;

            var validateResult = KiemTraSanPham(sanPhamHienTai);

            if (validateResult != "OK")
                return validateResult;

            try
            {
                _sanPhamrepo.Update(sanPhamHienTai);
                _sanPhamrepo.Save();

                return "Cập nhật sản phẩm thành công";
            }
            catch
            {
                return "Không thể cập nhật sản phẩm";
            }
        }

        public string XoaSanPham(string id)
        {
            var sanPham = _sanPhamrepo.GetById(id);

            if (sanPham == null)
                return "Không tìm thấy sản phẩm";

            return _sanPhamrepo.XoaSanPhamKemDuLieuLienQuan(id);
        }
    }
}
