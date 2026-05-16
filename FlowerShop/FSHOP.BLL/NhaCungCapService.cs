using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.BLL
{
    public class NhaCungCapService
    {
        private readonly INhaCungCapRepository _NCCrepo;

        public NhaCungCapService(INhaCungCapRepository repo)
        {
            _NCCrepo = repo;
        }

        public IEnumerable<NhaCungCap> GetAll() => _NCCrepo.GetAll();

        public NhaCungCap GetById(string id) => _NCCrepo.GetById(id);

        public string Create(NhaCungCap ncc)
        {
            _NCCrepo.Add(ncc);
            _NCCrepo.Save();
            return "Thêm nhà cung cấp thành công";
        }

        public string Update(string id, NhaCungCap ncc)
        {
            var old = _NCCrepo.GetById(id);

            if (old == null)
                return "Không tìm thấy nhà cung cấp";

            old.TenNcc = ncc.TenNcc;
            old.DiaChi = ncc.DiaChi;
            old.Sdt = ncc.Sdt;
            old.Email = ncc.Email;
            old.MaSoThue = ncc.MaSoThue;

            _NCCrepo.Update(old);
            _NCCrepo.Save();

            return "Cập nhật nhà cung cấp thành công";
        }

        public string Delete(string id)
        {
            var old = _NCCrepo.GetById(id);

            if (old == null)
                return "Không tìm thấy nhà cung cấp";

            _NCCrepo.Delete(id);
            _NCCrepo.Save();

            return "Xóa nhà cung cấp thành công";
        }
    }
}
