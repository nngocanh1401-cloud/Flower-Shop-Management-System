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
                // 1. Kéo dữ liệu từ View lên RAM (sử dụng LINQ to Objects)
                var danhSachTonKho = _context.VwTonKhoSanPhams.ToList();

                if (danhSachTonKho.Count == 0)
                {
                    return (false, "Không có dữ liệu tồn kho để xuất.");
                }

                // 2. Sử dụng LINQ to XML để tạo cấu trúc phân cấp
                XDocument xmlDoc = new XDocument(
                    new XDeclaration("1.0", "utf-8", "yes"),
                    new XElement("BaoCaoTonKho",
                        new XAttribute("NgayXuat", DateTime.Now.ToString("dd-MM-yyyy HH:mm")),

                        // Vòng lặp LINQ biến mỗi dòng dữ liệu thành một block XML
                        danhSachTonKho.Select(item =>
                            new XElement("SanPham",
                                new XElement("MaSp", item.MaSp),
                                new XElement("TenSp", item.TenSp),
                                new XElement("SoLuongTon", item.SoLuongTon)
                            )
                        )
                    )
                );

                // 3. Lưu thành tệp vật lý tại đường dẫn được chỉ định
                xmlDoc.Save(filePath);

                return (true, $"Đã xuất file XML thành công tại: {filePath}");
            }
            catch (Exception ex)
            {
                // Bắt lỗi nếu không có quyền ghi file hoặc đường dẫn sai
                return (false, $"Lỗi khi xuất file XML: {ex.Message}");
            }
        }

        public IEnumerable<ThongKeNhapKhoDTO> ThongKeTongNhapTheoSanPham()
        {
            // 1. Lấy dữ liệu thô và ép lên RAM
            var toanBoChiTiet = _context.ChiTietNhapHangs.ToList();

            // 2. Thao tác LINQ to Objects
            var ketQuaThongKe = toanBoChiTiet
                // Dùng .Where để lọc bớt dữ liệu rác (ví dụ chỉ lấy chi tiết có số lượng > 0)
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
