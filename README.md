# Flower Shop Management System

## Giới thiệu dự án

Flower Shop Management System là hệ thống quản lý cửa hàng hoa được xây dựng nhằm hỗ trợ quản lý và vận hành hoạt động bán hoa. Hệ thống giúp quản lý sản phẩm, khách hàng, đơn hàng, nhà cung cấp và phiếu nhập hàng một cách hiệu quả.

Hệ thống hỗ trợ:

- Quản lý sản phẩm
- Quản lý khách hàng
- Quản lý đơn hàng
- Quản lý phiếu nhập hàng, nhà cung cấp
- Website bán hoa trực tuyến

# 1. Technologies Used

- ASP.NET Core Web API
- Angular: 19.2.22
- Angular CLI: 19.2.26 
- SQL Server
- Entity Framework Core
- JWT Authentication
- Swagger

# 2. Main Features

## 2.1 Admin

- Đăng nhập hệ thống
- Quản lý sản phẩm
- Quản lý khách hàng
- Quản lý đơn hàng
- Quản lý nhà cung cấp
- Quản lý phiếu nhập hàng
- Xem báo cáo doanh thu

## 2.2 Customer

- Xem sản phẩm
- Tìm kiếm sản phẩm

# 3. Project Structure

```txt
Flower-Shop-Management-System
│
├── DataBase & T-SQL          # Database scripts
├── FlowerShop
│ ├── FSHOP.WEB                # ASP.NET Core Web API
│ ├── FSHOP.BLL 		  # Business Logic Layer
│ ├── FSHOP.DAL 		  # Data Access Layer
│ ├── FSHOP.Common	  # DTO
│ └── FSHOP.Angular 	  # Angular Frontend
│
├── README.md
└── .gitignore
``` 

# 4. Installation

## 4.1 Backend

### 4.1.1. Clone project

```bash
git clone https://github.com/your-repository/Flower-Shop-Management-System.git
```

### 4.1.2. Open solution in Visual Studio 2022

Mở file solution:

```txt
FlowerShop.sln
```

### 4.1.3. Run Database Scripts

Mở SQL Server Management Studio và chạy các file SQL trong thư mục `DataBase & T-SQL`.

Thứ tự chạy:

```txt
1. Create DB Table.sql
2. T-SQL database.sql
3. DuLieuMau.sql
4. Function.sql
5. Views.sql
6. StoredProcedures & Trigger.sql
```

### 4.1.4. Update Connection String

Mở file:

```txt
appsettings.json
```

Cập nhật chuỗi kết nối:

```json
"ConnectionStrings": {
  "FShopDB": "Data Source=CHUOI_CA_NHAN;Initial Catalog= FShopABP;Integrated Security=True;TrustServerCertificate=True"
}
```

### 4.1.5. Run Backend

- Right click `FSHOP.API` chọn Set as Startup Project
- Nhấn `F5`

## 4.2 Frontend

Mở terminal:

```bash
cd FSHOP.Angular
```

Cài thư viện:

```bash
npm install
```

Chạy Angular:

```bash
npm start
```

Hoặc:

```bash
ng serve
```

Frontend sẽ chạy tại:

```txt
http://localhost:4200
```

# 5. Default Accounts

## 5.1 Admin

- Username: admin
- Password: Admin@123

## 5.2 Customer

- Đăng ký tài khoản mới từ Swagger

# 6. Swagger

Sau khi chạy Backend, Swagger sẽ mở tại:

```txt
https://localhost:7066/swagger
```

# 7. Database

- SQL Server
- Database name: FSHOP

# 8. Future Improvements

- Hoàn thiện giỏ hàng
- Hoàn thiện login/logout và register
- Thanh toán trực tuyến
- Upload ảnh sản phẩm
- Gửi email xác nhận đơn hàng
- Báo cáo nâng cao
- Tối ưu giao diện responsive
- Tích hợp chatbot hỗ trợ khách hàng

# 9. Team Members

- Nguyễn Ngọc Anh - 2354050007
- Bùi Thị Thu Hương - 2354050047
- Lê Thị Huyền - 2351050065

# 10. License

This project is for educational purposes only.


