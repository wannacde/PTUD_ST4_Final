# BÁO CÁO DỰ ÁN: HỆ THỐNG QUẢN LÝ HIỆU SÁCH ONLINE (BOOKSTORE)

## Công nghệ sử dụng

| Thành phần | Công nghệ                     |
|-----------|-------------------------------|
| Backend   | Node.js, Express.js           |
| Frontend  | React.js, Material UI (MUI)   |
| Database  | MongoDB + Mongoose            |
| Auth      | JWT (JSON Web Token) + bcrypt |
| Upload    | Multer                        |

## Danh sách 12 Model

| # | Model        | Chức năng                            |
|---|--------------|--------------------------------------|
| 1 | User         | Tài khoản người dùng & phân quyền    |
| 2 | Book         | Sách (sản phẩm chính)                |
| 3 | Category     | Thể loại sách                        |
| 4 | CartItem     | Giỏ hàng                             |
| 5 | Order        | Đơn hàng                             |
| 6 | Review       | Đánh giá sách                        |
| 7 | WishlistItem | Danh sách yêu thích                  |
| 8 | DiscountCode | Mã giảm giá                          |
| 9 | Publisher    | Nhà xuất bản                         |
|10 | Address      | Địa chỉ giao hàng của user           |
|11 | Notification | Thông báo hệ thống cho user          |
|12 | Banner       | Banner / slide quảng cáo trang chủ   |

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

# Seed dữ liệu mẫu (12 sách, 6 thể loại, 3 nhà xuất bản, 3 mã giảm giá, 2 tài khoản)
node seed.js

# Chạy cả backend (port 5000) + frontend (port 3000)
npm run dev
```

---

## PHẦN 1: DEMO BẰNG GIAO DIỆN FRONTEND (http://localhost:3000)

### 1.1. Chức năng chung (Không cần đăng nhập)

| # | Chức năng | URL cụ thể | Thao tác |
|---|-----------|------------|----------|
| 1 | Trang chủ — danh sách sách + banner | `http://localhost:3000/` | Mở trình duyệt, xem banner trang chủ, danh sách sách và các bộ lọc |
| 2 | Tìm kiếm sách | `http://localhost:3000/` | Nhập tên / tác giả vào ô tìm kiếm ở hero section |
| 3 | Lọc theo thể loại / nhà xuất bản | `http://localhost:3000/` | Chọn dropdown thể loại hoặc nhà xuất bản ở trang chủ |
| 4 | Xem chi tiết sách | `http://localhost:3000/books/<bookId>` | Click "Xem chi tiết" trên bất kỳ sách nào |
| 5 | Đăng ký tài khoản | `http://localhost:3000/register` | Điền username, email, password → Submit |
| 6 | Đăng nhập | `http://localhost:3000/login` | Nhập email + password → Đăng nhập |

### 1.2. Chức năng User (Đăng nhập trước: `http://localhost:3000/login` — nguyenvan@gmail.com / user123)

| # | Chức năng | URL cụ thể | Thao tác |
|---|-----------|------------|----------|
| 1 | Xem chi tiết sách | `http://localhost:3000/books/<bookId>` | Click "Xem chi tiết" từ trang chủ |
| 2 | Thêm vào giỏ hàng | `http://localhost:3000/books/<bookId>` | Click "Thêm vào giỏ hàng" |
| 3 | Thêm vào yêu thích | `http://localhost:3000/books/<bookId>` | Click "Yêu thích" |
| 4 | Xem giỏ hàng | `http://localhost:3000/cart` | Click icon giỏ hàng trên navbar |
| 5 | Thay đổi số lượng trong giỏ | `http://localhost:3000/cart` | Click nút **+** / **−** bên cạnh số lượng |
| 6 | Xóa sản phẩm khỏi giỏ | `http://localhost:3000/cart` | Click icon thùng rác ở hàng sản phẩm |
| 7 | Áp dụng mã giảm giá | `http://localhost:3000/cart` | Nhập `WELCOME10` vào ô "Mã giảm giá" → "Áp dụng" |
| 8 | Đặt hàng | `http://localhost:3000/cart` | Click "Đặt hàng ngay" |
| 9 | Xem lịch sử đơn hàng | `http://localhost:3000/orders` | Click "Đơn hàng" trên navbar |
| 10 | Xem danh sách yêu thích | `http://localhost:3000/wishlist` | Click icon ♥ trên navbar |
| 11 | Xóa khỏi yêu thích | `http://localhost:3000/wishlist` | Click "Xóa" trên card sách |
| 12 | Viết đánh giá sách | `http://localhost:3000/books/<bookId>` | Kéo xuống phần Reviews → điền rating + comment → Submit |
| 13 | Xem & cập nhật thông tin cá nhân | `http://localhost:3000/profile` | Click avatar trên navbar → "Thông tin cá nhân" |
| 14 | Quản lý địa chỉ giao hàng | `http://localhost:3000/profile` | Kéo xuống phần "Địa chỉ giao hàng" → thêm/sửa/xóa |
| 15 | Xem thông báo | `http://localhost:3000/profile` | Kéo xuống phần "Thông báo" để xem thông báo đặt hàng / cập nhật trạng thái đơn |
| 16 | Xem badge thông báo chưa đọc | `http://localhost:3000/` | Quan sát icon chuông trên navbar sau khi có thông báo mới |

### 1.3. Chức năng Admin (Đăng nhập trước: `http://localhost:3000/login` — admin@bookstore.com / admin123)

| # | Chức năng | URL cụ thể | Thao tác |
|---|-----------|------------|----------|
| 1 | Quản lý Sách | `http://localhost:3000/admin/books` | Navbar → "Quản lý" → "Quản lý Sách" |
| 2 | Thêm sách mới | `http://localhost:3000/admin/books` | Click "+ Thêm sách", điền form, upload ảnh |
| 3 | Sửa sách | `http://localhost:3000/admin/books` | Click icon ✏️ ở hàng sách cần sửa |
| 4 | Xóa sách | `http://localhost:3000/admin/books` | Click icon 🗑️ ở hàng sách cần xóa |
| 5 | Quản lý Thể loại | `http://localhost:3000/admin/categories` | Navbar → "Quản lý" → "Quản lý Thể loại" |
| 6 | Thêm / sửa / xóa thể loại | `http://localhost:3000/admin/categories` | Dùng các nút trong bảng |
| 7 | Quản lý Đơn hàng | `http://localhost:3000/admin/orders` | Navbar → "Quản lý" → "Quản lý Đơn hàng" |
| 8 | Cập nhật trạng thái đơn | `http://localhost:3000/admin/orders` | Chọn dropdown trạng thái ở từng đơn. Khi chuyển sang `Đã thanh toán`, hệ thống tự động trừ tồn kho sách |
| 9 | Quản lý Người dùng | `http://localhost:3000/admin/users` | Navbar → "Quản lý" → "Quản lý Người dùng" |
| 10 | Đổi role / xóa user | `http://localhost:3000/admin/users` | Dùng các nút trong bảng |
| 11 | Quản lý Mã giảm giá | `http://localhost:3000/admin/discountcodes` | Navbar → "Quản lý" → "Quản lý Mã giảm giá" |
| 12 | Thêm / xóa mã giảm giá | `http://localhost:3000/admin/discountcodes` | Dùng các nút trong bảng |
| 13 | Quản lý Nhà xuất bản | `http://localhost:3000/admin/publishers` | Navbar → "Quản lý" → "Quản lý Nhà xuất bản" |
| 14 | Thêm / sửa / xóa NXB | `http://localhost:3000/admin/publishers` | Dùng các nút trong bảng |
| 15 | Quản lý Banner | `http://localhost:3000/admin/banners` | Navbar → "Quản lý" → "Quản lý Banner" |
| 16 | Thêm / bật tắt / xóa banner | `http://localhost:3000/admin/banners` | Click vào Chip trạng thái để bật/tắt nhanh |

---

## PHẦN 2: DEMO BẰNG POSTMAN (http://localhost:5000/api)

> **Lưu ý:** Các API cần đăng nhập phải gửi header:
> `Authorization: Bearer <token>`
> (Token lấy từ response của API Login bên dưới)

### 2.1. Authentication (Xác thực)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | POST | `http://localhost:5000/api/auth/register` | `{ "username":"test", "email":"test@mail.com", "password":"123456" }` | Không | Đăng ký tài khoản |
| 2 | POST | `http://localhost:5000/api/auth/login` | `{ "email":"admin@bookstore.com", "password":"admin123" }` | Không | Đăng nhập → lấy token |
| 3 | GET | `http://localhost:5000/api/auth/me` | — | User | Xem thông tin cá nhân |
| 4 | PUT | `http://localhost:5000/api/auth/me` | form-data: username, email, avatar (file) | User | Cập nhật thông tin |
| 5 | GET | `http://localhost:5000/api/auth/users` | — | Admin | Xem tất cả người dùng |
| 6 | PUT | `http://localhost:5000/api/auth/users/:id/role` | `{ "role":"admin" }` | Admin | Đổi vai trò người dùng |
| 7 | DELETE | `http://localhost:5000/api/auth/users/:id` | — | Admin | Xóa người dùng |

### 2.2. Books (Sách)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/books` | — | Không | Lấy danh sách sách |
| 2 | GET | `http://localhost:5000/api/books/:id` | — | Không | Xem chi tiết sách |
| 3 | POST | `http://localhost:5000/api/books` | form-data: title, author, price, description, category, publisher, stock, image (file) | Admin | Thêm sách mới |
| 4 | PUT | `http://localhost:5000/api/books/:id` | form-data: title, author, price, category, publisher, stock, description, image (file) | Admin | Cập nhật sách |
| 5 | DELETE | `http://localhost:5000/api/books/:id` | — | Admin | Xóa sách |

### 2.3. Categories (Thể loại)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/categories` | — | Không | Lấy tất cả thể loại |
| 2 | POST | `http://localhost:5000/api/categories` | `{ "name":"Tâm lý", "description":"..." }` | Admin | Thêm thể loại |
| 3 | PUT | `http://localhost:5000/api/categories/:id` | `{ "name":"Tâm lý học" }` | Admin | Sửa thể loại |
| 4 | DELETE | `http://localhost:5000/api/categories/:id` | — | Admin | Xóa thể loại |

### 2.4. Cart (Giỏ hàng)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/cart` | — | User | Xem giỏ hàng |
| 2 | POST | `http://localhost:5000/api/cart` | `{ "bookId":"<bookId>", "quantity":2 }` | User | Thêm sách vào giỏ |
| 3 | PUT | `http://localhost:5000/api/cart/:id` | `{ "quantity":3 }` | User | Cập nhật số lượng |
| 4 | DELETE | `http://localhost:5000/api/cart/:id` | — | User | Xóa 1 item khỏi giỏ |
| 5 | DELETE | `http://localhost:5000/api/cart` | — | User | Xóa toàn bộ giỏ hàng |

### 2.5. Orders (Đơn hàng)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | POST | `http://localhost:5000/api/orders` | `{ "discountCode":"WELCOME10" }` | User | Đặt hàng từ giỏ hàng hiện tại |
| 2 | GET | `http://localhost:5000/api/orders` | — | User | Xem đơn hàng của tôi |
| 3 | GET | `http://localhost:5000/api/orders/all` | — | Admin | Xem tất cả đơn hàng |
| 4 | PUT | `http://localhost:5000/api/orders/:id/status` | `{ "status":"shipped" }` | Admin | Cập nhật trạng thái đơn |

### 2.6. Wishlist (Yêu thích)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/wishlist` | — | User | Xem danh sách yêu thích |
| 2 | POST | `http://localhost:5000/api/wishlist` | `{ "bookId":"<bookId>" }` | User | Thêm vào yêu thích |
| 3 | DELETE | `http://localhost:5000/api/wishlist/:id` | — | User | Xóa khỏi yêu thích |

### 2.7. Reviews (Đánh giá)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/reviews/book/:bookId` | — | Không | Xem đánh giá của 1 sách |
| 2 | POST | `http://localhost:5000/api/reviews/book/:bookId` | `{ "rating":5, "comment":"Sách rất hay!" }` | User | Viết đánh giá |
| 3 | DELETE | `http://localhost:5000/api/reviews/:id` | — | User | Xóa đánh giá của mình |

### 2.8. Discount Codes (Mã giảm giá)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/discountcodes` | — | Admin | Xem tất cả mã |
| 2 | POST | `http://localhost:5000/api/discountcodes` | `{ "code":"TET30", "discount":30, "description":"Giảm Tết 30%" }` | Admin | Tạo mã giảm giá |
| 3 | POST | `http://localhost:5000/api/discountcodes/apply` | `{ "code":"WELCOME10" }` | User | Áp dụng mã giảm giá |
| 4 | DELETE | `http://localhost:5000/api/discountcodes/:id` | — | Admin | Xóa mã giảm giá |

### 2.9. Publishers (Nhà xuất bản)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/publishers` | — | Không | Lấy danh sách nhà xuất bản |
| 2 | GET | `http://localhost:5000/api/publishers/:id` | — | Không | Xem chi tiết NXB |
| 3 | POST | `http://localhost:5000/api/publishers` | `{ "name":"NXB Kim Đồng", "address":"Hà Nội", "phone":"024...", "email":"kim@nxb.vn" }` | Admin | Thêm nhà xuất bản |
| 4 | PUT | `http://localhost:5000/api/publishers/:id` | `{ "phone":"0901234567" }` | Admin | Cập nhật NXB |
| 5 | DELETE | `http://localhost:5000/api/publishers/:id` | — | Admin | Xóa nhà xuất bản |

### 2.10. Address (Địa chỉ giao hàng)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/address` | — | User | Xem danh sách địa chỉ của tôi |
| 2 | POST | `http://localhost:5000/api/address` | `{ "fullName":"Nguyễn Văn A", "phone":"0901234567", "address":"123 Lê Lợi", "city":"Thành phố Hồ Chí Minh", "district":"Quận 1", "ward":"Phường Bến Nghé", "isDefault":true }` | User | Thêm địa chỉ mới |
| 3 | PUT | `http://localhost:5000/api/address/:id` | `{ "phone":"0909999999", "ward":"Phường Bến Nghé", "isDefault":true }` | User | Cập nhật địa chỉ |
| 4 | DELETE | `http://localhost:5000/api/address/:id` | — | User | Xóa địa chỉ |

### 2.11. Notifications (Thông báo)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/notifications` | — | User | Xem thông báo của tôi (bao gồm đặt hàng thành công, cập nhật trạng thái đơn, hoặc thông báo admin gửi) |
| 2 | PUT | `http://localhost:5000/api/notifications/read-all` | — | User | Đánh dấu tất cả đã đọc |
| 3 | PUT | `http://localhost:5000/api/notifications/:id/read` | — | User | Đánh dấu 1 thông báo đã đọc |
| 4 | DELETE | `http://localhost:5000/api/notifications/:id` | — | User | Xóa thông báo |
| 5 | POST | `http://localhost:5000/api/notifications/send` | `{ "userId":"<id>", "title":"Thông báo mới", "message":"Đơn hàng đã giao!", "type":"order" }` | Admin | Gửi thông báo đến user |

### 2.12. Banners (Banner quảng cáo)

| # | Method | URL đầy đủ | Body | Auth | Mô tả |
|---|--------|------------|------|------|-------|
| 1 | GET | `http://localhost:5000/api/banners` | — | Không | Lấy banner đang hoạt động |
| 2 | GET | `http://localhost:5000/api/banners/all` | — | Admin | Xem tất cả banner |
| 3 | POST | `http://localhost:5000/api/banners` | `{ "title":"Khuyến mãi hè", "imageUrl":"https://...", "link":"/books", "isActive":true, "order":1 }` | Admin | Tạo banner mới |
| 4 | PUT | `http://localhost:5000/api/banners/:id` | `{ "isActive":false }` | Admin | Cập nhật banner |
| 5 | DELETE | `http://localhost:5000/api/banners/:id` | — | Admin | Xóa banner |

---

## PHỤ LỤC: API CHÍNH ĐỂ TEST POSTMAN

> Mục này chỉ tổng hợp **các API chính** của hệ thống để dễ chụp màn hình minh họa khi nộp báo cáo.  
> Nếu cần đầy đủ toàn bộ API, xem lại **PHẦN 2** phía trên.

### 1. Đăng nhập lấy token

- **Method:** `POST`
- **URL đầy đủ:** `http://localhost:5000/api/auth/login`
- **Body JSON:**

```json
{
	"email": "admin@bookstore.com",
	"password": "admin123"
}
```

- **Mục đích:** Đăng nhập và lấy token để test các API cần xác thực.

### 2. Lấy thông tin cá nhân

- **Method:** `GET`
- **URL đầy đủ:** `http://localhost:5000/api/auth/me`
- **Header:** `Authorization: Bearer <token>`
- **Body:** Không có
- **Mục đích:** Kiểm tra token hợp lệ và lấy thông tin user hiện tại.

### 3. Lấy danh sách sách

- **Method:** `GET`
- **URL đầy đủ:** `http://localhost:5000/api/books`
- **Body:** Không có
- **Mục đích:** API công khai để hiển thị danh sách sách ở trang chủ.

### 4. Thêm sách mới

- **Method:** `POST`
- **URL đầy đủ:** `http://localhost:5000/api/books`
- **Header:** `Authorization: Bearer <admin_token>`
- **Body:** `form-data`

```text
title: Clean Architecture
author: Robert C. Martin
price: 210000
description: Sach ve kien truc phan mem
category: Cong nghe
publisher: NXB Tong Hop
stock: 12
image: (file)
```

- **Mục đích:** Minh họa API thêm sách có dùng Category + Publisher.

### 5. Lấy danh sách thể loại

- **Method:** `GET`
- **URL đầy đủ:** `http://localhost:5000/api/categories`
- **Body:** Không có
- **Mục đích:** Lấy dữ liệu thể loại để quản lý admin và lọc sách ở Home.

### 6. Lấy danh sách nhà xuất bản

- **Method:** `GET`
- **URL đầy đủ:** `http://localhost:5000/api/publishers`
- **Body:** Không có
- **Mục đích:** Lấy dữ liệu nhà xuất bản để quản lý admin và lọc sách ở Home.

### 7. Thêm vào giỏ hàng

- **Method:** `POST`
- **URL đầy đủ:** `http://localhost:5000/api/cart`
- **Header:** `Authorization: Bearer <user_token>`
- **Body JSON:**

```json
{
	"bookId": "<bookId>",
	"quantity": 2
}
```

- **Mục đích:** Thêm sách vào giỏ hàng.

### 8. Áp dụng mã giảm giá

- **Method:** `POST`
- **URL đầy đủ:** `http://localhost:5000/api/discountcodes/apply`
- **Header:** `Authorization: Bearer <user_token>`
- **Body JSON:**

```json
{
	"code": "WELCOME10"
}
```

- **Mục đích:** Kiểm tra mã giảm giá trước khi đặt hàng.

### 9. Đặt hàng

- **Method:** `POST`
- **URL đầy đủ:** `http://localhost:5000/api/orders`
- **Header:** `Authorization: Bearer <user_token>`
- **Body JSON:**

```json
{
	"discountCode": "WELCOME10"
}
```

- **Mục đích:** Tạo đơn hàng từ giỏ hàng hiện tại.

### 10. Lấy đơn hàng của tôi

- **Method:** `GET`
- **URL đầy đủ:** `http://localhost:5000/api/orders`
- **Header:** `Authorization: Bearer <user_token>`
- **Body:** Không có
- **Mục đích:** Xem lịch sử đơn hàng của user.

### 11. Xem tất cả đơn hàng

- **Method:** `GET`
- **URL đầy đủ:** `http://localhost:5000/api/orders/all`
- **Header:** `Authorization: Bearer <admin_token>`
- **Body:** Không có
- **Mục đích:** Minh họa API quản trị đơn hàng.

### 12. Gửi thông báo cho user

- **Method:** `POST`
- **URL đầy đủ:** `http://localhost:5000/api/notifications/send`
- **Header:** `Authorization: Bearer <admin_token>`
- **Body JSON:**

```json
{
	"userId": "<userId>",
	"title": "Thong bao moi",
	"message": "Don hang da duoc xac nhan",
	"type": "order"
}
```

- **Mục đích:** Minh họa model Notification trong thực tế. Ngoài gửi thủ công từ admin, hệ thống hiện cũng tự tạo thông báo khi user đặt hàng và khi admin cập nhật trạng thái đơn.

### 13. Lấy banner đang hoạt động

- **Method:** `GET`
- **URL đầy đủ:** `http://localhost:5000/api/banners`
- **Body:** Không có
- **Mục đích:** Lấy banner hiển thị ở trang chủ.

### 14. Tạo banner mới

- **Method:** `POST`
- **URL đầy đủ:** `http://localhost:5000/api/banners`
- **Header:** `Authorization: Bearer <admin_token>`
- **Body JSON:**

```json
{
	"title": "Khuyen mai he",
	"imageUrl": "https://example.com/banner.jpg",
	"link": "/books",
	"isActive": true,
	"order": 1
}
```

- **Mục đích:** Minh họa API quản trị banner trang chủ.

## PHẦN 3: TRÌNH TỰ DEMO GỢI Ý

### Bước 1 — Giới thiệu hệ thống
- Trình bày kiến trúc: MERN Stack (MongoDB, Express, React, Node.js)
- Mở `http://localhost:3000/` → giới thiệu giao diện trang chủ, banner, thanh điều hướng, bộ lọc thể loại / nhà xuất bản

### Bước 2 — Demo chức năng User (Frontend)

| # | Thao tác | URL |
|---|----------|-----|
| 1 | Đăng ký tài khoản mới | `http://localhost:3000/register` |
| 2 | Đăng nhập bằng tài khoản user | `http://localhost:3000/login` — dùng `nguyenvan@gmail.com / user123` |
| 3 | Tìm kiếm sách | `http://localhost:3000/` — nhập từ khóa vào ô tìm kiếm |
| 4 | Xem chi tiết sách | `http://localhost:3000/books/<bookId>` — click "Xem chi tiết" |
| 5 | Thêm vào giỏ hàng | `http://localhost:3000/books/<bookId>` — click "Thêm vào giỏ hàng" |
| 6 | Thêm vào Wishlist | `http://localhost:3000/books/<bookId>` — click "Yêu thích" |
| 7 | Viết đánh giá sách | `http://localhost:3000/books/<bookId>` — kéo xuống phần Reviews |
| 8 | Vào giỏ hàng, áp mã giảm giá | `http://localhost:3000/cart` — nhập `WELCOME10` → "Áp dụng" |
| 9 | Đặt hàng | `http://localhost:3000/cart` — click "Đặt hàng ngay" |
| 10 | Xem lịch sử đơn hàng | `http://localhost:3000/orders` |
| 11 | Xem Wishlist | `http://localhost:3000/wishlist` |
| 12 | Cập nhật thông tin cá nhân & địa chỉ | `http://localhost:3000/profile` |
| 13 | Xem badge thông báo và mục thông báo | `http://localhost:3000/profile` |

### Bước 3 — Demo chức năng Admin (Frontend)

| # | Thao tác | URL |
|---|----------|-----|
| 1 | Đăng nhập admin | `http://localhost:3000/login` — dùng `admin@bookstore.com / admin123` |
| 2 | Quản lý Sách — thêm / sửa / xóa | `http://localhost:3000/admin/books` |
| 3 | Quản lý Thể loại | `http://localhost:3000/admin/categories` |
| 4 | Quản lý Đơn hàng — cập nhật trạng thái | `http://localhost:3000/admin/orders` |
| 5 | Quản lý Người dùng — đổi role | `http://localhost:3000/admin/users` |
| 6 | Quản lý Mã giảm giá | `http://localhost:3000/admin/discountcodes` |
| 7 | Quản lý Nhà xuất bản | `http://localhost:3000/admin/publishers` |
| 8 | Quản lý Banner | `http://localhost:3000/admin/banners` — click Chip để bật/tắt nhanh |

### Bước 4 — Demo API bằng Postman
1. `POST http://localhost:5000/api/auth/login` → lấy token
2. Demo 2–3 API tiêu biểu: `POST /api/orders`, `GET /api/books`, `POST /api/discountcodes/apply`
3. Demo thông báo tự động: sau khi đặt hàng hoặc đổi trạng thái đơn, gọi `GET /api/notifications`
4. Cho thấy validation: gửi thiếu field → nhận lỗi 400
5. Cho thấy phân quyền: user gọi `DELETE /api/books/:id` → nhận lỗi 403

### Bước 5 — Kết luận
- Tóm tắt các chức năng đã hoàn thành (12 model, 16+ luồng giao diện frontend bao gồm banner, lọc sách, badge thông báo)
- Hướng phát triển: thanh toán online, gợi ý sách, phân trang, ...

---

## MÃ GIẢM GIÁ CÓ SẴN

| Mã         | Giảm       | Mô tả                           |
|-----------|------------|----------------------------------|
| WELCOME10 | 10%        | Giảm 10% cho khách hàng mới     |
| SUMMER20  | 20%        | Khuyến mãi hè — Giảm 20%       |
| BOOK50K   | 50.000đ    | Giảm 50.000đ cho đơn từ 200.000đ |
