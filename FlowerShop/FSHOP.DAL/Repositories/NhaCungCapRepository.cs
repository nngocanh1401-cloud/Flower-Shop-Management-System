using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.DAL.Repositories
{
    public class NhaCungCapRepository : INhaCungCapRepository
    {
        private readonly string _connectionString;

        public NhaCungCapRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        // ===== HÀM DÙNG CHUNG ĐỌC DỮ LIỆU =====
        private NhaCungCap MapFromReader(SqlDataReader reader)
        {
            return new NhaCungCap
            {
                MaNcc = reader["MaNCC"].ToString(),
                TenNcc = reader["TenNCC"].ToString(),
                DiaChi = reader["DiaChi"].ToString(),
                Sdt = reader["SDT"].ToString(),
                Email = reader["Email"].ToString(),
                MaSoThue = reader["MaSoThue"].ToString()
            };
        }

        // GET ALL
        public IEnumerable<NhaCungCap> GetAll()
        {
            var list = new List<NhaCungCap>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT * FROM NhaCungCap", conn);

            conn.Open();
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
                list.Add(MapFromReader(reader));

            return list;
        }

        // GET BY ID
        public NhaCungCap GetById(object id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "SELECT * FROM NhaCungCap WHERE MaNCC = @MaNCC", conn);

            cmd.Parameters.AddWithValue("@MaNCC", id);

            conn.Open();
            using var reader = cmd.ExecuteReader();
            if (reader.Read())
                return MapFromReader(reader);

            return null;
        }

        // ===== ADD =====
        public void Add(NhaCungCap entity)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(@"
            INSERT INTO NhaCungCap (MaNCC, TenNCC, DiaChi, SDT, Email, MaSoThue)
            VALUES (@MaNCC, @TenNCC, @DiaChi, @SDT, @Email, @MaSoThue)", conn);

            cmd.Parameters.AddWithValue("@MaNCC", entity.MaNcc);
            cmd.Parameters.AddWithValue("@TenNCC", entity.TenNcc);
            cmd.Parameters.AddWithValue("@DiaChi", (object?)entity.DiaChi ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@SDT", (object?)entity.Sdt ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", (object?)entity.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MaSoThue", (object?)entity.MaSoThue ?? DBNull.Value);

            conn.Open();
            cmd.ExecuteNonQuery();
        }

        // ===== UPDATE =====
        public void Update(NhaCungCap entity)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(@"
            UPDATE NhaCungCap
            SET TenNCC   = @TenNCC,
                DiaChi   = @DiaChi,
                SDT      = @SDT,
                Email    = @Email,
                MaSoThue = @MaSoThue
            WHERE MaNCC = @MaNCC", conn);

            cmd.Parameters.AddWithValue("@MaNCC", entity.MaNcc);
            cmd.Parameters.AddWithValue("@TenNCC", entity.TenNcc);
            cmd.Parameters.AddWithValue("@DiaChi", (object?)entity.DiaChi ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@SDT", (object?)entity.Sdt ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", (object?)entity.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MaSoThue", (object?)entity.MaSoThue ?? DBNull.Value);

            conn.Open();
            cmd.ExecuteNonQuery();
        }

        // ===== DELETE =====
        public void Delete(object id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "DELETE FROM NhaCungCap WHERE MaNCC = @MaNCC", conn);

            cmd.Parameters.AddWithValue("@MaNCC", id);

            conn.Open();
            cmd.ExecuteNonQuery();
        }

        // ===== SEARCH BY NAME =====
        public IEnumerable<NhaCungCap> SearchByName(string tenNCC)
        {
            var list = new List<NhaCungCap>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "SELECT * FROM NhaCungCap WHERE TenNCC LIKE @TenNCC", conn);

            cmd.Parameters.AddWithValue("@TenNCC", $"%{tenNCC}%");

            conn.Open();
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
                list.Add(MapFromReader(reader));

            return list;
        }

        // ===== GET BY MA SO THUE =====
        public NhaCungCap GetByMaSoThue(string maSoThue)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "SELECT * FROM NhaCungCap WHERE MaSoThue = @MaSoThue", conn);

            cmd.Parameters.AddWithValue("@MaSoThue", maSoThue);

            conn.Open();
            using var reader = cmd.ExecuteReader();
            if (reader.Read())
                return MapFromReader(reader);

            return null;
        }
    }
}
