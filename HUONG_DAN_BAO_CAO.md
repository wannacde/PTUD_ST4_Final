# BÁO CÁO DỰ ÁN: HỆ THỐNG QUẢN LÝ HIỆU SÁCH ONLINE (BOOKSTORE)

## Công nghệ sử dụng

| Thành phần | Công nghệ                     |
|-----------|-------------------------------|
| Backend   | Node.js, Express.js           |
| Frontend  | React.js, Material UI (MUI)   |
| Database  | MongoDB + Mongoose            |
| Auth      | JWT (JSON Web Token) + bcrypt |
| Upload    | Multer                        |

---

## TÀI KHOẢN ĐĂNG NHẬP

| Vai trò | Email                  | Mật khẩu   | Quyền hạn                              |
|---------|------------------------|-------------|----------------------------------------|
| Admin   | admin@bookstore.com    | admin123    | Toàn quyền quản lý hệ thống            |
| User    | nguyenvan@gmail.com    | user123     | Xem sách, mua hàng, đánh giá, wishlist |

> Có thể tạo thêm tài khoản mới qua trang Đăng ký.

---

## CÁCH CHẠY DỰ ÁN

```bash
# Cài đặt tất cả dependencies
npm run install-all

# Seed dữ liệu mẫu (12 sách, 6 thể loại, 3 mã giảm giá, 2 tài khoản)
node seed.js

# Chạy cả backend (port 5000) + frontend (port 3000)
npm run dev
```

---

## PHẦN 1: DEMO BẰNG GIAO DIỆN FRONTEND (http://localhost:3000)

### 1.1. Chức năng chung (Không cần đăng nhập)
- [ ] Xem trang chủ — danh sách sách với ô tìm kiếm
- [ ] Tìm kiếm sách theo tên / tác giả
- [ ] Xem chi tiết sách (mô tả, giá, đánh giá)
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập

### 1.2. Chức năng User (Đăng nhập: nguyenvan@gmail.com / user123)
- [ ] Thêm sách vào giỏ hàng
- [ ] Xem giỏ hàng, thay đổi số lượng, xóa sản phẩm
- [ ] Đặt hàng (áp dụng mã giảm giá nếu có)
- [ ] Xem lịch sử đơn hàng
- [ ] Thêm/xóa sách khỏi danh sách yêu thích (Wishlist)
- [ ] Viết đánh giá (review) cho sách
- [ ] Xem & cập nhật thông tin cá nhân (username, email, avatar)

### 1.3. Chức năng Admin (Đăng nhập: admin@bookstore.com / admin123)
- [ ] Quản lý Sách — thêm, sửa, xóa sách (có upload ảnh)
- [ ] Quản lý Thể loại — thêm, sửa, xóa thể loại
- [ ] Quản lý Đơn hàng — xem tất cả đơn, cập nhật trạng thái
- [ ] Quản lý Người dùng — xem danh sách, đổi role, xóa user
- [ ] Quản lý Mã giảm giá — thêm, xóa mã giảm giá

---

## PHẦN 2: DEMO BẰNG POSTMAN (http://localhost:5000/api)

> **Lưu ý:** Các API cần đăng nhập phải gửi header:
> `Authorization: Bearer <token>`
> (Token lấy từ response của API Login)

### 2.1. Authentication (Xác thực)

| # | Method | URL                          | Body                                                            | Auth   | Mô tả                    |
|---|--------|------------------------------|-----------------------------------------------------------------|--------|--------------------------|
| 1 | POST   | /api/auth/register           | `{ "username":"test", "email":"test@mail.com", "password":"123456" }` | Không  | Đăng ký tài khoản        |
| 2 | POST   | /api/auth/login              | `{ "email":"admin@bookstore.com", "password":"admin123" }`      | Không  | Đăng nhập → lấy token    |
| 3 | GET    | /api/auth/me                 | —                                                               | User   | Xem thông tin cá nhân    |
| 4 | PUT    | /api/auth/me                 | form-data: username, email, avatar (file)                       | User   | Cập nhật thông tin        |
| 5 | GET    | /api/auth/users              | —                                                               | Admin  | Xem tất cả người dùng    |
| 6 | PUT    | /api/auth/users/:id/role     | `{ "role":"admin" }`                                            | Admin  | Đổi vai trò người dùng   |
| 7 | DELETE | /api/auth/users/:id          | —                                                               | Admin  | Xóa người dùng           |

### 2.2. Books (Sách)

| # | Method | URL                | Body                                                           | Auth   | Mô tả              |
|---|--------|--------------------|----------------------------------------------------------------|--------|---------------------|
| 1 | GET    | /api/books         | —                                                              | Không  | Lấy danh sách sách  |
| 2 | GET    | /api/books/:id     | —                                                              | Không  | Xem chi tiết sách   |
| 3 | POST   | /api/books         | form-data: title, author, price, description, category, stock, image (file) | Admin  | Thêm sách mới       |
| 4 | PUT    | /api/books/:id     | form-data: title, author, price, ... image (file)              | Admin  | Cập nhật sách        |
| 5 | DELETE | /api/books/:id     | —                                                              | Admin  | Xóa sách             |

### 2.3. Categories (Thể loại)

| # | Method | URL                    | Body                                         | Auth   | Mô tả            |
|---|--------|------------------------|----------------------------------------------|--------|-------------------|
| 1 | GET    | /api/categories        | —                                            | Không  | Lấy tất cả thể loại |
| 2 | POST   | /api/categories        | `{ "name":"Tâm lý", "description":"..." }`   | Admin  | Thêm thể loại     |
| 3 | PUT    | /api/categories/:id    | `{ "name":"Tâm lý học" }`                    | Admin  | Sửa thể loại      |
| 4 | DELETE | /api/categories/:id    | —                                            | Admin  | Xóa thể loại      |

### 2.4. Cart (Giỏ hàng)

| # | Method | URL              | Body                                        | Auth  | Mô tả                     |
|---|--------|------------------|---------------------------------------------|-------|----------------------------|
| 1 | GET    | /api/cart        | —                                           | User  | Xem giỏ hàng               |
| 2 | POST   | /api/cart        | `{ "book":"<bookId>", "quantity":2 }`       | User  | Thêm sách vào giỏ          |
| 3 | PUT    | /api/cart/:id    | `{ "quantity":3 }`                          | User  | Cập nhật số lượng           |
| 4 | DELETE | /api/cart/:id    | —                                           | User  | Xóa 1 item khỏi giỏ        |
| 5 | DELETE | /api/cart        | —                                           | User  | Xóa toàn bộ giỏ hàng       |

### 2.5. Orders (Đơn hàng)

| # | Method | URL                        | Body                                                    | Auth   | Mô tả                    |
|---|--------|----------------------------|---------------------------------------------------------|--------|--------------------------|
| 1 | POST   | /api/orders                | `{ "items":[{"book":"<bookId>","quantity":1}], "discountCode":"WELCOME10" }` | User   | Đặt hàng                  |
| 2 | GET    | /api/orders                | —                                                       | User   | Xem đơn hàng của tôi      |
| 3 | GET    | /api/orders/all            | —                                                       | Admin  | Xem tất cả đơn hàng       |
| 4 | PUT    | /api/orders/:id/status     | `{ "status":"shipped" }`                                | Admin  | Cập nhật trạng thái đơn   |

### 2.6. Wishlist (Yêu thích)

| # | Method | URL                  | Body                          | Auth  | Mô tả                     |
|---|--------|----------------------|-------------------------------|-------|----------------------------|
| 1 | GET    | /api/wishlist        | —                             | User  | Xem danh sách yêu thích    |
| 2 | POST   | /api/wishlist        | `{ "book":"<bookId>" }`      | User  | Thêm vào yêu thích         |
| 3 | DELETE | /api/wishlist/:id    | —                             | User  | Xóa khỏi yêu thích         |

### 2.7. Reviews (Đánh giá)

| # | Method | URL                         | Body                                           | Auth  | Mô tả                   |
|---|--------|-----------------------------|-------------------------------------------------|-------|--------------------------|
| 1 | GET    | /api/reviews/book/:bookId   | —                                               | Không | Xem đánh giá của 1 sách  |
| 2 | POST   | /api/reviews/book/:bookId   | `{ "rating":5, "comment":"Sách rất hay!" }`    | User  | Viết đánh giá             |
| 3 | DELETE | /api/reviews/:id            | —                                               | User  | Xóa đánh giá của mình    |

### 2.8. Discount Codes (Mã giảm giá)

| # | Method | URL                        | Body                                                              | Auth   | Mô tả               |
|---|--------|----------------------------|-------------------------------------------------------------------|--------|----------------------|
| 1 | GET    | /api/discountcodes         | —                                                                 | Admin  | Xem tất cả mã        |
| 2 | POST   | /api/discountcodes         | `{ "code":"TET30", "discount":30, "description":"Giảm Tết 30%" }` | Admin  | Tạo mã giảm giá      |
| 3 | POST   | /api/discountcodes/apply   | `{ "code":"WELCOME10" }`                                         | User   | Áp dụng mã giảm giá  |
| 4 | DELETE | /api/discountcodes/:id     | —                                                                 | Admin  | Xóa mã giảm giá      |

---

## PHẦN 3: TRÌNH TỰ DEMO GỢI Ý

### Bước 1 — Giới thiệu hệ thống
- Trình bày kiến trúc: MERN Stack (MongoDB, Express, React, Node.js)
- Mở frontend → giới thiệu giao diện trang chủ, thanh điều hướng

### Bước 2 — Demo chức năng User (Frontend)
1. Đăng ký tài khoản mới
2. Đăng nhập bằng tài khoản user
3. Tìm kiếm sách → Xem chi tiết
4. Thêm vào giỏ hàng → Thêm vào wishlist
5. Viết đánh giá cho sách
6. Vào giỏ hàng → Đặt hàng (dùng mã WELCOME10)
7. Xem lịch sử đơn hàng
8. Cập nhật thông tin cá nhân

### Bước 3 — Demo chức năng Admin (Frontend)
1. Đăng nhập admin
2. Quản lý sách: thêm sách mới (upload ảnh), sửa, xóa
3. Quản lý thể loại: thêm, sửa, xóa
4. Quản lý đơn hàng: xem đơn, cập nhật trạng thái
5. Quản lý người dùng: xem danh sách, đổi role
6. Quản lý mã giảm giá: thêm, xóa

### Bước 4 — Demo API bằng Postman
1. Login → lấy token
2. Demo 2-3 API tiêu biểu (VD: tạo sách, đặt hàng, áp dụng mã giảm giá)
3. Cho thấy validation (gửi thiếu field → báo lỗi)
4. Cho thấy phân quyền (user gọi API admin → bị từ chối 403)

### Bước 5 — Kết luận
- Tóm tắt các chức năng đã hoàn thành
- Hướng phát triển: thanh toán online, gợi ý sách, phân trang, ...

---

## MÃ GIẢM GIÁ CÓ SẴN

| Mã         | Giảm       | Mô tả                           |
|-----------|------------|----------------------------------|
| WELCOME10 | 10%        | Giảm 10% cho khách hàng mới     |
| SUMMER20  | 20%        | Khuyến mãi hè — Giảm 20%       |
| BOOK50K   | 50.000đ    | Giảm 50.000đ cho đơn từ 200.000đ |
