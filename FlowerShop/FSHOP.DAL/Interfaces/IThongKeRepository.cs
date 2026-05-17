using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FSHOP.Common.DTOs.HeThong;

namespace FSHOP.DAL.Interfaces
{
    public interface IThongKeRepository
    {
        // Trả về true nếu xuất file thành công, ngược lại báo lỗi
        (bool IsSuccess, string Message) XuatTonKhoRaXml(string filePath);
        IEnumerable<ThongKeNhapKhoDTO> ThongKeTongNhapTheoSanPham();
    }
}
