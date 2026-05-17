using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace FSHOP.DAL.Models;

public partial class FshopContext : DbContext
{
    public FshopContext()
    {
    }

    public FshopContext(DbContextOptions<FshopContext> options): base(options)
    {
    }
    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; }

    public virtual DbSet<ChiTietNhapHang> ChiTietNhapHangs { get; set; }

    public virtual DbSet<DanhMuc> DanhMucs { get; set; }

    public virtual DbSet<DonHang> DonHangs { get; set; }

    public virtual DbSet<KhachHang> KhachHangs { get; set; }

    public virtual DbSet<NhaCungCap> NhaCungCaps { get; set; }

    public virtual DbSet<PhieuNhapHang> PhieuNhapHangs { get; set; }

    public virtual DbSet<PhuongThucThanhToan> PhuongThucThanhToans { get; set; }

    public virtual DbSet<SanPham> SanPhams { get; set; }

    public virtual DbSet<TrangThai> TrangThais { get; set; }

    public virtual DbSet<Voucher> Vouchers { get; set; }
    public virtual DbSet<VwBaoCaoSanPham> VwBaoCaoSanPhams { get; set; }

    public virtual DbSet<VwChiTietDonHang> VwChiTietDonHangs { get; set; }

    public virtual DbSet<VwDoanhThuTheoThang> VwDoanhThuTheoThangs { get; set; }

    public virtual DbSet<VwTonKhoSanPham> VwTonKhoSanPhams { get; set; }

    public virtual DbSet<VwTopSanPhamBanChay> VwTopSanPhamBanChays { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChiTietDonHang>(entity =>
        {
            entity.HasKey(e => new { e.MaDh, e.MaSp }).HasName("PK__ChiTietD__F557D6E058DD3C98");

            entity.ToTable("ChiTietDonHang");

            entity.Property(e => e.MaDh)
                .HasMaxLength(1000)
                .HasColumnName("MaDH");
            entity.Property(e => e.MaSp)
                .HasMaxLength(10)
                .HasColumnName("MaSP");
            entity.Property(e => e.DonGia).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MaDhNavigation).WithMany(p => p.ChiTietDonHangs)
                .HasForeignKey(d => d.MaDh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiTietDon__MaDH__76969D2E");

            entity.HasOne(d => d.MaSpNavigation).WithMany(p => p.ChiTietDonHangs)
                .HasForeignKey(d => d.MaSp)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiTietDon__MaSP__778AC167");
        });

        modelBuilder.Entity<ChiTietNhapHang>(entity =>
        {
            entity.HasKey(e => new { e.MaPhieuNhap, e.MaSp }).HasName("PK__ChiTietN__C602BFBAD58B821A");

            entity.ToTable("ChiTietNhapHang");

            entity.Property(e => e.MaPhieuNhap).HasMaxLength(10);
            entity.Property(e => e.MaSp)
                .HasMaxLength(10)
                .HasColumnName("MaSP");
            entity.Property(e => e.DonGia).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MaPhieuNhapNavigation).WithMany(p => p.ChiTietNhapHangs)
                .HasForeignKey(d => d.MaPhieuNhap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiTietNh__MaPhi__7F2BE32F");

            entity.HasOne(d => d.MaSpNavigation).WithMany(p => p.ChiTietNhapHangs)
                .HasForeignKey(d => d.MaSp)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiTietNha__MaSP__00200768");
        });

        modelBuilder.Entity<DanhMuc>(entity =>
        {
            entity.HasKey(e => e.MaDm).HasName("PK__DanhMuc__2725866E0318305A");

            entity.ToTable("DanhMuc");

            entity.Property(e => e.MaDm)
                .HasMaxLength(10)
                .HasColumnName("MaDM");
            entity.Property(e => e.MaDmcha)
                .HasMaxLength(10)
                .HasColumnName("MaDMCha");
            entity.Property(e => e.Mota).HasMaxLength(200);
            entity.Property(e => e.TenDm)
                .HasMaxLength(100)
                .HasColumnName("TenDM");

            entity.HasOne(d => d.MaDmchaNavigation).WithMany(p => p.InverseMaDmchaNavigation)
                .HasForeignKey(d => d.MaDmcha)
                .HasConstraintName("FK__DanhMuc__MaDMCha__693CA210");
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.HasKey(e => e.MaDh).HasName("PK__DonHang__272586614B67028F");

            entity.ToTable("DonHang");

            entity.Property(e => e.MaDh)
                .HasMaxLength(10)
                .HasColumnName("MaDH");
            entity.Property(e => e.MaKh)
                .HasMaxLength(10)
                .HasColumnName("MaKH");
            entity.Property(e => e.MaPttt).HasColumnName("MaPTTT");
            entity.Property(e => e.MaVoucher).HasMaxLength(10);
            entity.Property(e => e.NgayDat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TongTien).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MaKhNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaKh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHang__MaKH__6FE99F9F");

            entity.HasOne(d => d.MaPtttNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaPttt)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHang__MaPTTT__70DDC3D8");

            entity.HasOne(d => d.MaTrangThaiNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaTrangThai)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHang__MaTrang__72C60C4A");

            entity.HasOne(d => d.MaVoucherNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaVoucher)
                .HasConstraintName("FK__DonHang__MaVouch__71D1E811");
        });

        modelBuilder.Entity<KhachHang>(entity =>
        {
            entity.HasKey(e => e.MaKh).HasName("PK__KhachHan__2725CF1E5BBE6503");

            entity.ToTable("KhachHang");

            entity.Property(e => e.MaKh)
                .HasMaxLength(10)
                .HasColumnName("MaKH");
            entity.Property(e => e.DiaChi).HasMaxLength(200);
            entity.Property(e => e.Sdt)
                .HasMaxLength(10)
                .HasColumnName("SDT");
            entity.Property(e => e.TenKh)
                .HasMaxLength(100)
                .HasColumnName("TenKH");
        });

        modelBuilder.Entity<NhaCungCap>(entity =>
        {
            entity.HasKey(e => e.MaNcc).HasName("PK__NhaCungC__3A185DEBCD8A6312");

            entity.ToTable("NhaCungCap");

            entity.Property(e => e.MaNcc)
                .HasMaxLength(10)
                .HasColumnName("MaNCC");
            entity.Property(e => e.DiaChi).HasMaxLength(200);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.MaSoThue).HasMaxLength(10);
            entity.Property(e => e.Sdt)
                .HasMaxLength(10)
                .HasColumnName("SDT");
            entity.Property(e => e.TenNcc)
                .HasMaxLength(100)
                .HasColumnName("TenNCC");
        });

        modelBuilder.Entity<PhieuNhapHang>(entity =>
        {
            entity.HasKey(e => e.MaPhieuNhap).HasName("PK__PhieuNha__1470EF3BFCD067EA");

            entity.ToTable("PhieuNhapHang");

            entity.Property(e => e.MaPhieuNhap).HasMaxLength(10);
            entity.Property(e => e.MaNcc)
                .HasMaxLength(10)
                .HasColumnName("MaNCC");
            entity.Property(e => e.NgayNhap)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TongTien).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MaNccNavigation).WithMany(p => p.PhieuNhapHangs)
                .HasForeignKey(d => d.MaNcc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhieuNhap__MaNCC__7A672E12");

            entity.HasOne(d => d.MaTrangThaiNavigation).WithMany(p => p.PhieuNhapHangs)
                .HasForeignKey(d => d.MaTrangThai)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhieuNhap__MaTra__7B5B524B");
        });

        modelBuilder.Entity<PhuongThucThanhToan>(entity =>
        {
            entity.HasKey(e => e.MaPttt).HasName("PK__PhuongTh__B30A2802A2F2570A");

            entity.ToTable("PhuongThucThanhToan");

            entity.Property(e => e.MaPttt)
                .ValueGeneratedNever()
                .HasColumnName("MaPTTT");
            entity.Property(e => e.TenPttt)
                .HasMaxLength(50)
                .HasColumnName("TenPTTT");
        });

        modelBuilder.Entity<SanPham>(entity =>
        {
            entity.HasKey(e => e.MaSp).HasName("PK__SanPham__2725081CCD599FE4");

            entity.ToTable("SanPham");

            entity.Property(e => e.MaSp)
                .HasMaxLength(10)
                .HasColumnName("MaSP");
            entity.Property(e => e.DonGia).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MaDm)
                .HasMaxLength(10)
                .HasColumnName("MaDM");
            entity.Property(e => e.TenSp)
                .HasMaxLength(100)
                .HasColumnName("TenSP");

            entity.HasOne(d => d.MaDmNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaDm)
                .HasConstraintName("FK__SanPham__MaDM__6D0D32F4");
        });

        modelBuilder.Entity<TrangThai>(entity =>
        {
            entity.HasKey(e => e.MaTrangThai).HasName("PK__TrangTha__AADE4138070CE2D4");

            entity.ToTable("TrangThai");

            entity.Property(e => e.MaTrangThai).ValueGeneratedNever();
            entity.Property(e => e.LoaiTrangThai)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.MoTa).HasMaxLength(255);
            entity.Property(e => e.TenTrangThai).HasMaxLength(100);
        });

        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.HasKey(e => e.MaVoucher).HasName("PK__Voucher__0AAC5B11851A9AF1");

            entity.ToTable("Voucher");

            entity.Property(e => e.MaVoucher).HasMaxLength(10);
            entity.Property(e => e.DieuKienApDung)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.GiaTriGiam).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.LoaiGiam).HasMaxLength(20);
            entity.Property(e => e.NgayBd).HasColumnName("NgayBD");
            entity.Property(e => e.NgayKt).HasColumnName("NgayKT");
            entity.Property(e => e.SoLuongDaDung).HasDefaultValue(0);
            entity.Property(e => e.TenVoucher).HasMaxLength(100);
        });

        modelBuilder.Entity<VwChiTietDonHang>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_ChiTietDonHang");

            entity.Property(e => e.DonGia).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MaDh)
                .HasMaxLength(10)
                .HasColumnName("MaDH");
            entity.Property(e => e.NgayDat).HasColumnType("datetime");
            entity.Property(e => e.PhuongThucThanhToan).HasMaxLength(50);
            entity.Property(e => e.Sdt)
                .HasMaxLength(10)
                .HasColumnName("SDT");
            entity.Property(e => e.TenKh)
                .HasMaxLength(100)
                .HasColumnName("TenKH");
            entity.Property(e => e.TenSp)
                .HasMaxLength(100)
                .HasColumnName("TenSP");
            entity.Property(e => e.TenTrangThai).HasMaxLength(100);
            entity.Property(e => e.TenVoucher).HasMaxLength(100);
            entity.Property(e => e.ThanhTien).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.TongTien).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<VwDoanhThuTheoThang>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_DoanhThuTheoThang","dbo");

            entity.Property(e => e.TongDoanhThu).HasColumnType("decimal(38, 2)");
        });

        modelBuilder.Entity<VwTonKhoSanPham>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_TonKhoSanPham");

            entity.Property(e => e.DanhMuc).HasMaxLength(100);
            entity.Property(e => e.DonGia).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MaSp)
                .HasMaxLength(10)
                .HasColumnName("MaSP");
            entity.Property(e => e.TenSp)
                .HasMaxLength(100)
                .HasColumnName("TenSP");
            entity.Property(e => e.TrangThaiTon).HasMaxLength(20);
        });

        modelBuilder.Entity<VwTopSanPhamBanChay>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_TopSanPhamBanChay");

            entity.Property(e => e.DanhMuc).HasMaxLength(100);
            entity.Property(e => e.MaSp)
                .HasMaxLength(10)
                .HasColumnName("MaSP");
            entity.Property(e => e.TenSp)
                .HasMaxLength(100)
                .HasColumnName("TenSP");
            entity.Property(e => e.TongDoanhThu).HasColumnType("decimal(38, 2)");
        });

        OnModelCreatingPartial(modelBuilder);

        modelBuilder.Entity<VwBaoCaoSanPham>(entity =>
        {
            entity.HasNoKey().ToView("vw_BaoCaoSanPham");

            entity.Property(e => e.MaSp)
                .HasColumnName("MaSP");

            entity.Property(e => e.TenSp)
                .HasColumnName("TenSP");

            entity.Property(e => e.DonGia)
                .HasColumnType("decimal(18,2)");
        });

        //  Cấu hình bảng VaiTro 
        modelBuilder.Entity<VaiTro>(entity =>
        {
            entity.HasKey(e => e.MaVaiTro).HasName("PK__VaiTro__C24C7424"); // Tên PK tùy theo DB của bạn
            entity.ToTable("VaiTro");

            entity.Property(e => e.MaVaiTro).HasMaxLength(10);
            entity.Property(e => e.TenVaiTro).HasMaxLength(50).IsRequired();
        });

        //  Cấu hình bảng NguoiDung 
        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PK__NguoiDun__C5410BD9");
            entity.ToTable("NguoiDung");

            entity.Property(e => e.MaNguoiDung).HasMaxLength(20);
            entity.Property(e => e.TenDangNhap).HasMaxLength(50).IsRequired();
            entity.Property(e => e.MatKhauHash).IsRequired();

            entity.Property(e => e.MaKh)
                .HasMaxLength(10)
                .HasColumnName("MaKH");

            entity.Property(e => e.IsActive).HasDefaultValueSql("((1))");

            // Cấu hình quan hệ với bảng VaiTro
            entity.HasOne(d => d.MaVaiTroNavigation)
                .WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaVaiTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NguoiDung_VaiTro");

            // Cấu hình quan hệ với bảng KhachHang (nếu có MaKH)
            entity.HasOne(d => d.MaKhNavigation)
                .WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaKh)
                .HasConstraintName("FK_NguoiDung_KhachHang");
        });

        OnModelCreatingPartial(modelBuilder);

        modelBuilder.Entity<VwBaoCaoSanPham>().HasNoKey().ToView("Vw_BaoCaoSanPham");
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

}   
