using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using FSHOP.Common.DTOs.HeThong;

namespace FSHOP.DAL.Repositories
{
    public class ThongKeRepository : IThongKeRepository
    {
        private readonly FshopContext _context;

        public ThongKeRepository(FshopContext context)
        {
            _context = context;
        }

        public (bool IsSuccess, string Message) XuatTonKhoRaXml(string filePath)
        {
            try
            {
                // Kéo dữ liệu từ View lên
                var danhSachTonKho = _context.VwTonKhoSanPhams.ToList();

                if (danhSachTonKho.Count == 0)
                {
                    return (false, "Không có dữ liệu tồn kho để xuất.");
                }

                // Tạo cấu trúc phân câp bằng LINQ to XML
                XDocument xmlDoc = new XDocument(
                    new XDeclaration("1.0", "utf-8", "yes"),
                    new XElement("BaoCaoTonKho",
                        new XAttribute("NgayXuat", DateTime.Now.ToString("dd-MM-yyyy HH:mm")),

                        danhSachTonKho.Select(item =>
                            new XElement("SanPham",
                                new XElement("MaSp", item.MaSp),
                                new XElement("TenSp", item.TenSp),
                                new XElement("SoLuongTon", item.SoLuongTon)
                            )
                        )
                    )
                );

                // Lưu
                xmlDoc.Save(filePath);

                return (true, $"Đã xuất file XML thành công tại: {filePath}");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi khi xuất file XML: {ex.Message}");
            }
        }

        public IEnumerable<ThongKeNhapKhoDTO> ThongKeTongNhapTheoSanPham()
        {
            // Lấy dữ liệu
            var toanBoChiTiet = _context.ChiTietNhapHangs.ToList();

            // Thao tác LINQ to Objects
            var ketQuaThongKe = toanBoChiTiet
                // Dùng .Where để lọc bớt dữ liệu rác
                .Where(ct => ct.SoLuong > 0)

                // Dùng .GroupBy để gom tất cả các dòng có chung Mã Sản Phẩm lại thành 1 nhóm
                .GroupBy(ct => ct.MaSp)
                .Select(nhom => new ThongKeNhapKhoDTO
                {
                    MaSp = nhom.Key,

                    // Dùng .Sum để cộng dồn tất cả thuộc tính SoLuong bên trong nhóm đó
                    TongSoLuongNhap = nhom.Sum(ct => ct.SoLuong)
                })
                .ToList(); // Đóng gói kết quả cuối cùng thành List để trả về cho tầng Service

            return ketQuaThongKe;
        }
    }
}
