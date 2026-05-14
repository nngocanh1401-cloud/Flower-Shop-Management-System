using FSHOP.Common.DTO.Kho;
using FSHOP.Common.DTOs.Kho;
using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.BLL
{
    public class PhieuNhapHangService
    {
        private readonly IPhieuNhapHangRepository _phieuNhapHangRepo;

        public PhieuNhapHangService(IPhieuNhapHangRepository repo)
        {
            _phieuNhapHangRepo = repo;
        }
        public IEnumerable<PhieuNhapHang> GetAll()
        {
            return _phieuNhapHangRepo.GetAll();
        }

        public PhieuNhapHangDTO GetById(string id)
        {
            var p = _phieuNhapHangRepo.GetById(id);

            if (p == null) return null;

            return new PhieuNhapHangDTO
            {
                MaPhieuNhap = p.MaPhieuNhap,
                MaNCC = p.MaNcc,
                MaTrangThai = p.MaTrangThai,
                NgayNhap = p.NgayNhap,
                TongTien = p.TongTien
            };
        }
        public string TaoPhieuNhap(TaoPhieuNhapDTO dto)
        {
            if (dto.DanhSachChiTiet == null || !dto.DanhSachChiTiet.Any())
                return "Phiếu nhập phải có ít nhất một sản phẩm";

            try
            {
                foreach (var ct in dto.DanhSachChiTiet)
                {
                    _phieuNhapHangRepo.ThemPhieuNhap(
                        dto.MaPhieuNhap,
                        dto.MaNCC,
                        6,
                        ct.MaSP,
                        ct.SoLuong
                    );
                }

                return "Nhập hàng thành công";
            }
            catch (Exception ex)
            {
                return ex.GetBaseException().Message;
            }
        }
        public string CapNhatPhieuNhap(string id, CapNhatPhieuNhapDTO dto)
        {
            var old = _phieuNhapHangRepo.GetById(id);

            if (old == null)
                return "Không tìm thấy phiếu nhập";

            old.MaNcc = dto.MaNCC;
            old.MaTrangThai = dto.MaTrangThai;
            old.NgayNhap = dto.NgayNhap ?? old.NgayNhap;

            _phieuNhapHangRepo.Update(old);
            _phieuNhapHangRepo.Save();

            return "Cập nhật phiếu nhập thành công";
        }

        public string XoaPhieuNhap(string id)
        {
            var old = _phieuNhapHangRepo.GetById(id);

            if (old == null)
                return "Không tìm thấy phiếu nhập";

            try
            {
                _phieuNhapHangRepo.XoaPhieuNhapKemChiTiet(id);
                return "Xóa phiếu nhập thành công";
            }
            catch (Exception ex)
            {
                return ex.GetBaseException().Message;
            }
        }
    }
}

