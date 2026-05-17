import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-bao-cao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule
  ],
  templateUrl: './bao-cao.component.html',
  styleUrl: './bao-cao.component.css'
})
export class BaoCaoComponent implements OnInit {
  nam: number = new Date().getFullYear();
  thang: number | null = new Date().getMonth() + 1;

  danhSachNam: number[] = [];

  danhSachThang: any[] = [
    { label: 'Tất cả', value: null },
    { label: 'Tháng 1', value: 1 },
    { label: 'Tháng 2', value: 2 },
    { label: 'Tháng 3', value: 3 },
    { label: 'Tháng 4', value: 4 },
    { label: 'Tháng 5', value: 5 },
    { label: 'Tháng 6', value: 6 },
    { label: 'Tháng 7', value: 7 },
    { label: 'Tháng 8', value: 8 },
    { label: 'Tháng 9', value: 9 },
    { label: 'Tháng 10', value: 10 },
    { label: 'Tháng 11', value: 11 },
    { label: 'Tháng 12', value: 12 }
  ];

  dangTai: boolean = false;

  tongDoanhThu: number = 0;
  tongTonKho: number = 0;
  tongDaBan: number = 0;
  sanPhamBanChay: string = 'Chưa có dữ liệu';

  duLieuDoanhThu: any[] = [];
  duLieuTonKho: any[] = [];
  duLieuTop10: any[] = [];
  duLieuDoanhThuNamXml: any[] = [];
  tongDoanhThuNamXml: number = 0;

  // =========================
  // CHART DOANH THU
  // =========================
  doanhThuChart: any = {
    type: 'area',
    height: 330,
    toolbar: { show: false },
    zoom: { enabled: false }
  };

  doanhThuSeries: any[] = [
    {
      name: 'Doanh thu',
      data: []
    }
  ];

  doanhThuXAxis: any = {
    categories: []
  };

  doanhThuStroke: any = {
    curve: 'smooth',
    width: 3
  };

  doanhThuDataLabels: any = {
    enabled: false
  };

  doanhThuTooltip: any = {
    y: {
      formatter: (value: number) => `${this.dinhDangTien(value)} đ`
    }
  };

  doanhThuFill: any = {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    }
  };

  doanhThuYAxis: any = {
    min: 0,
    tickAmount: 5,
    forceNiceScale: true,
    labels: {
      formatter: (value: number) => this.rutGonTien(value)
    },
    title: {
      text: 'Doanh thu'
    }
  };

  // =========================
  // CHART TỒN KHO
  // =========================
  tonKhoChart: any = {
    type: 'donut',
    height: 330
  };

  tonKhoSeries: number[] = [];
  tonKhoLabels: string[] = [];

  tonKhoLegend: any = {
    position: 'bottom'
  };

  tonKhoTooltip: any = {
    y: {
      formatter: (value: number) => `${value} sản phẩm`
    }
  };

  tonKhoResponsive: any[] = [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 280
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ];

  // =========================
  // CHART TOP 10
  // =========================
  top10Chart: any = {
    type: 'bar',
    height: 390,
    toolbar: { show: false }
  };

  top10Series: any[] = [
    {
      name: 'Số lượng bán',
      data: []
    }
  ];

  top10XAxis: any = {
    categories: []
  };

  top10PlotOptions: any = {
    bar: {
      horizontal: true,
      borderRadius: 6,
      distributed: false
    }
  };

  top10DataLabels: any = {
    enabled: true
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.khoiTaoDanhSachNam();
    this.taiTatCaBaoCao();
  }

  khoiTaoDanhSachNam() {
    const namHienTai = new Date().getFullYear();

    this.danhSachNam = [];

    for (let i = namHienTai - 5; i <= namHienTai + 1; i++) {
      this.danhSachNam.push(i);
    }
  }

  taiTatCaBaoCao() {
    this.dangTai = true;

    this.layBaoCaoDoanhThu();
    this.layBaoCaoTonKho();
    this.layTop10SanPham();

    setTimeout(() => {
      this.dangTai = false;
      this.cdr.detectChanges();
    }, 700);
  }

  locDoanhThu() {
    this.dangTai = true;

    this.layBaoCaoDoanhThu();

    setTimeout(() => {
      this.dangTai = false;
      this.cdr.detectChanges();
    }, 500);
  }

  // =========================
  // API DOANH THU
  // =========================
  layBaoCaoDoanhThu() {
    const apiUrl = environment.fshopApiUrl + '/api/BaoCao/doanhthu';

    let params = new HttpParams()
      .set('nam', this.nam);

    if (this.thang !== null && this.thang !== undefined) {
      params = params.set('thang', this.thang);
    }

    this.http.get<any>(apiUrl, { params }).subscribe({
      next: (res) => {
        const data = this.layMangDuLieu(res);

        this.duLieuDoanhThu = data;

        const categories = data.map((x: any, index: number) => {
          return this.layLabelDoanhThu(x, index);
        });

        const values = data.map((x: any) => {
          return this.laySoTienDoanhThu(x);
        });

        this.tongDoanhThu = values.reduce((sum: number, item: number) => sum + item, 0);

        setTimeout(() => {
          this.doanhThuXAxis = {
            categories: [...categories]
          };

          this.doanhThuSeries = [
            {
              name: 'Doanh thu',
              data: [...values]
            }
          ];

          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('Lỗi tải báo cáo doanh thu:', err);

        this.duLieuDoanhThu = [];
        this.doanhThuSeries = [{ name: 'Doanh thu', data: [] }];
        this.doanhThuXAxis = { categories: [] };
        this.tongDoanhThu = 0;

        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // API TỒN KHO
  // =========================
  layBaoCaoTonKho() {
    const apiUrl = environment.fshopApiUrl + '/api/BaoCao/tonkho';

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        const data = this.layMangDuLieu(res);

        this.duLieuTonKho = data;

        const dataSapXep = [...data]
          .sort((a: any, b: any) => this.laySoLuongTon(b) - this.laySoLuongTon(a))
          .slice(0, 8);

        this.tongTonKho = data.reduce((sum: number, item: any) => {
          return sum + this.laySoLuongTon(item);
        }, 0);

        const labels = dataSapXep.map((x: any) => this.layTenSanPham(x));
        const values = dataSapXep.map((x: any) => this.laySoLuongTon(x));

        setTimeout(() => {
          this.tonKhoLabels = [...labels];
          this.tonKhoSeries = [...values];

          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('Lỗi tải báo cáo tồn kho:', err);

        this.duLieuTonKho = [];
        this.tonKhoLabels = [];
        this.tonKhoSeries = [];
        this.tongTonKho = 0;

        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // API TOP 10
  // =========================
  layTop10SanPham() {
    const apiUrl = environment.fshopApiUrl + '/api/BaoCao/top10';

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        const data = this.layMangDuLieu(res);

        this.duLieuTop10 = data;

        const dataSapXep = [...data]
          .sort((a: any, b: any) => this.laySoLuongDaBan(b) - this.laySoLuongDaBan(a))
          .slice(0, 10);

        const categories = dataSapXep.map((x: any) => this.layTenSanPham(x));
        const values = dataSapXep.map((x: any) => this.laySoLuongDaBan(x));

        this.tongDaBan = values.reduce((sum: number, item: number) => sum + item, 0);
        this.sanPhamBanChay = dataSapXep.length > 0 ? this.layTenSanPham(dataSapXep[0]) : 'Chưa có dữ liệu';

        setTimeout(() => {
          this.top10XAxis = {
            categories: [...categories]
          };

          this.top10Series = [
            {
              name: 'Số lượng bán',
              data: [...values]
            }
          ];

          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('Lỗi tải top 10 sản phẩm:', err);

        this.duLieuTop10 = [];
        this.top10Series = [{ name: 'Số lượng bán', data: [] }];
        this.top10XAxis = { categories: [] };
        this.tongDaBan = 0;
        this.sanPhamBanChay = 'Chưa có dữ liệu';

        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // HÀM MAP DỮ LIỆU LINH HOẠT
  // =========================

  layMangDuLieu(res: any): any[] {
    if (!res) return [];

    if (Array.isArray(res)) return res;

    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.result)) return res.result;
    if (Array.isArray(res.items)) return res.items;
    if (Array.isArray(res.value)) return res.value;
    if (Array.isArray(res.$values)) return res.$values;

    return [res];
  }

  layLabelDoanhThu(item: any, index: number): string {
    const label =
      item.ngay ||
      item.ngayDat ||
      item.ngayBan ||
      item.date ||
      item.label ||
      item.tenNgay ||
      item.thang ||
      item.thangBaoCao ||
      item.month ||
      '';

    if (label) {
      if (!isNaN(Number(label)) && Number(label) >= 1 && Number(label) <= 12) {
        return `Tháng ${label}`;
      }

      return label.toString();
    }

    if (this.thang === null) {
      return `Tháng ${index + 1}`;
    }

    return `Ngày ${index + 1}`;
  }

  laySoTienDoanhThu(item: any): number {
    return Number(
      item.doanhThu ??
      item.tongDoanhThu ??
      item.tongTien ??
      item.tien ??
      item.giaTri ??
      item.revenue ??
      item.total ??
      0
    );
  }

  layTenSanPham(item: any): string {
    return (
      item.tenSP ||
      item.tenSp ||
      item.tenSanPham ||
      item.tenHoa ||
      item.maSP ||
      item.maSp ||
      'Không rõ'
    ).toString();
  }

  laySoLuongTon(item: any): number {
    return Number(
      item.soLuongTon ??
      item.tonKho ??
      item.soLuong ??
      item.quantity ??
      item.stock ??
      0
    );
  }

  laySoLuongDaBan(item: any): number {
    return Number(
      item.tongSoBan ??
      item.tongDaBan ??
      item.soLuongBan ??
      item.soLuongDaBan ??
      item.soLuongDaMua ??
      item.daBan ??
      item.slBan ??
      item.soLuong ??
      item.quantity ??
      item.totalSold ??
      item.total ??
      0
    );
  }

  // =========================
  // FORMAT
  // =========================

  dinhDangTien(value: number): string {
    return Number(value || 0).toLocaleString('vi-VN');
  }

  rutGonTien(value: number): string {
    const so = Number(value || 0);

    if (so >= 1000000000) {
      return `${(so / 1000000000).toFixed(1)} tỷ`;
    }

    if (so >= 1000000) {
      return `${(so / 1000000).toFixed(1)} tr`;
    }

    if (so >= 1000) {
      return `${(so / 1000).toFixed(0)}k`;
    }

    return so.toString();
  }

  layThangNamHienThi(): string {
    if (this.thang === null || this.thang === undefined) {
      return `Năm ${this.nam}`;
    }

    return `Tháng ${this.thang}/${this.nam}`;
  }

  // XUẤT XML

  xuatDoanhThuXml() {
    this.layDoanhThuCaNamDeXuatXml();
  }

  xuatTonKhoXml() {
    const xml = this.taoXmlTonKho();
    this.taiFileXml(xml, `bao-cao-ton-kho.xml`);
  }

  xuatTop10Xml() {
    const xml = this.taoXmlTop10();
    this.taiFileXml(xml, `bao-cao-top-10-san-pham.xml`);
  }

  taoXmlDoanhThuCaNam(): string {
    const namHienTai = new Date().getFullYear();
    const thangHienTai = new Date().getMonth() + 1;

    const thangKetThuc = Number(this.nam) === namHienTai ? thangHienTai : 12;

    const doanhThuTheoThang = new Map<number, number>();

    for (let i = 1; i <= thangKetThuc; i++) {
      doanhThuTheoThang.set(i, 0);
    }

    this.duLieuDoanhThuNamXml.forEach((item: any, index: number) => {
      const thang = this.layThangTuDuLieuDoanhThu(item, index);
      const doanhThu = this.laySoTienDoanhThu(item);

      if (thang >= 1 && thang <= thangKetThuc) {
        doanhThuTheoThang.set(thang, doanhThu);
      }
    });

    const rows = Array.from(doanhThuTheoThang.entries()).map(([thang, doanhThu]) => {
      return `
    <Dong>
      <Thang>Tháng ${thang}</Thang>
      <DoanhThu>${doanhThu}</DoanhThu>
    </Dong>`;
    }).join('');

    const tongDoanhThuNam = Array.from(doanhThuTheoThang.values())
      .reduce((sum: number, value: number) => sum + value, 0);

    return `<?xml version="1.0" encoding="UTF-8"?>
<BangDoanhThuNam>
  ${rows}
  <Dong>
    <Thang>Tổng doanh thu năm ${this.nam}</Thang>
    <DoanhThu>${tongDoanhThuNam}</DoanhThu>
  </Dong>
</BangDoanhThuNam>`;
  }

  taoXmlTonKho(): string {
    const dataSapXep = [...this.duLieuTonKho]
      .sort((a: any, b: any) => this.laySoLuongTon(b) - this.laySoLuongTon(a));

    const rows = dataSapXep.map((item: any) => {
      return `
    <Dong>
      <TenSanPham>${this.escapeXml(this.layTenSanPham(item))}</TenSanPham>
      <SoLuongTon>${this.laySoLuongTon(item)}</SoLuongTon>
    </Dong>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<BangTonKho>
  ${rows}
  <Dong>
    <TenSanPham>Tổng tồn kho</TenSanPham>
    <SoLuongTon>${this.tongTonKho}</SoLuongTon>
  </Dong>
</BangTonKho>`;
  }

  taoXmlTop10(): string {
    const dataSapXep = [...this.duLieuTop10]
      .sort((a: any, b: any) => this.laySoLuongDaBan(b) - this.laySoLuongDaBan(a))
      .slice(0, 10);

    const rows = dataSapXep.map((item: any) => {
      return `
    <Dong>
      <TenSanPham>${this.escapeXml(this.layTenSanPham(item))}</TenSanPham>
      <SoLuongDaBan>${this.laySoLuongDaBan(item)}</SoLuongDaBan>
      <DoanhThu>${this.layDoanhThuSanPham(item)}</DoanhThu>
    </Dong>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<BangTop10SanPham>
  ${rows}
</BangTop10SanPham>`;
  }

  layDoanhThuSanPham(item: any): number {
    return Number(
      item.tongDoanhThu ??
      item.doanhThu ??
      item.tongTien ??
      item.totalRevenue ??
      item.total ??
      0
    );
  }

  taiFileXml(noiDungXml: string, tenFile: string) {
    const blob = new Blob([noiDungXml], {
      type: 'application/xml;charset=utf-8'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = tenFile;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  escapeXml(value: any): string {
    if (value === null || value === undefined) return '';

    return value.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  layDoanhThuCaNamDeXuatXml() {
    const apiUrl = environment.fshopApiUrl + '/api/BaoCao/doanhthu';

    const params = new HttpParams()
      .set('nam', this.nam);

    this.http.get<any>(apiUrl, { params }).subscribe({
      next: (res) => {
        const data = this.layMangDuLieu(res);

        this.duLieuDoanhThuNamXml = data;

        this.tongDoanhThuNamXml = data.reduce((sum: number, item: any) => {
          return sum + this.laySoTienDoanhThu(item);
        }, 0);

        const xml = this.taoXmlDoanhThuCaNam();

        this.taiFileXml(xml, `bao-cao-doanh-thu-nam-${this.nam}.xml`);
      },
      error: (err) => {
        console.error('Lỗi xuất XML doanh thu năm:', err);
        alert('Không thể xuất XML doanh thu năm. Vui lòng kiểm tra API doanh thu.');
      }
    });
  }

  layThangTuDuLieuDoanhThu(item: any, index: number): number {
    const thang =
      item.thang ??
      item.thangBaoCao ??
      item.month ??
      item.monthNumber ??
      item.soThang ??
      null;

    if (thang !== null && thang !== undefined && !isNaN(Number(thang))) {
      return Number(thang);
    }

    const ngay =
      item.ngay ||
      item.ngayDat ||
      item.ngayBan ||
      item.date ||
      item.label ||
      '';

    if (ngay) {
      const date = new Date(ngay);

      if (!isNaN(date.getTime())) {
        return date.getMonth() + 1;
      }

      const match = ngay.toString().match(/(?:tháng|Tháng)?\s*(\d{1,2})/);

      if (match && Number(match[1]) >= 1 && Number(match[1]) <= 12) {
        return Number(match[1]);
      }
    }

    return index + 1;
  }
}