# Tuần 8 - BookStore Online

Đã làm đủ 3 câu của đề tuần 7 bằng React Native và TypeScript.

## Chạy bài

Mở hai terminal tại `Thực hành/tuan8`:

```powershell
# Terminal 1: backend json-server
npm run server
```

Lần chạy đầu, máy chủ tự tạo `server/db.json` từ `server/db.example.json` rồi thêm sách và đánh giá mẫu. `db.json` lưu dữ liệu cục bộ, không đưa lên Git để giữ riêng tài khoản và phiên đăng nhập.

```powershell
# Terminal 2: ứng dụng Expo
npm start
```

Quét QR bằng Expo Go. Điện thoại và máy tính cần cùng Wi-Fi, cho phép Node.js qua Windows Firewall nếu có yêu cầu. Ứng dụng tự lấy IP của máy đang chạy Expo. Khi cần chỉ định IP, tạo `.env.local` theo `.env.example`, sau đó khởi động lại Expo. Android Emulator có thể đặt `EXPO_PUBLIC_API_URL=http://10.0.2.2:3001`; web dùng `http://localhost:3001`.

## Kiểm tra và chụp báo cáo câu 1

1. Từ Home, chọn Đăng nhập / Đăng ký. Bấm Đăng nhập khi để trống hoặc nhập email sai, mật khẩu dưới 6 ký tự: lỗi xuất hiện dưới từng ô.
2. Chọn tab Đăng ký, nhập email hợp lệ và mật khẩu từ 6 ký tự. Thành công sẽ về tab Đăng nhập và hiện thông báo.
3. Nhập sai mật khẩu để xem lỗi từ API. Đăng ký lại email cũ để xem lỗi trùng email.
4. Đăng nhập đúng tài khoản vừa tạo: chuyển tới Home và hiển thị email từ Redux store `auth`.
5. Phiên `{ token, user }` được lưu bằng `AsyncStorage.setItem('auth', ...)`. Có thể kiểm tra tại Application → Local Storage → `auth` khi chạy `npm run web`.

API: `POST /register` nhận `{ email, password }`, trả user (201); `POST /login` nhận cùng dữ liệu, trả `{ token, user }` (200). Lỗi trả `{ message }`: 400 dữ liệu không hợp lệ, 401 sai tài khoản, 409 trùng email. Tài khoản và phiên đăng nhập được lưu trong `server/db.json`, mật khẩu được băm; token giả lập có thời hạn 7 ngày.

## Kiểm tra và chụp báo cáo câu 2

1. Đăng nhập, đóng/mở lại app (hoặc tải lại trang web): tự vào Home và vẫn hiện email. Khi khởi động, ứng dụng đọc AsyncStorage và gọi `GET /auth/me` với `Authorization: Bearer <token>` để kiểm tra phiên và lấy user.
2. Bấm Đăng xuất: Home hiện "Bạn chưa đăng nhập", khóa `auth` trong AsyncStorage bị xóa và Redux được xóa phiên. Nếu máy chủ đang hoạt động, `POST /logout` cũng thu hồi token. Tải lại ứng dụng để kiểm tra không tự đăng nhập lại.
3. Khi chưa đăng nhập, bấm Thanh toán: chuyển tới form Đăng nhập và hiện thông báo yêu cầu đăng nhập. Đăng nhập thành công phải vào thẳng Checkout, hiển thị đúng email. Chuyển tab Đăng ký rồi quay lại Đăng nhập vẫn giữ đường về Checkout.
4. Khi đã đăng nhập, từ Home bấm Thanh toán: vào Checkout trực tiếp. Mở thẳng đường dẫn `/checkout` khi chưa đăng nhập cũng phải chuyển sang Đăng nhập.
5. Trên web, sửa `token` trong Local Storage thành giá trị sai rồi tải lại: phiên bị xóa và Home hiển thị chưa đăng nhập. Token hết hạn cũng bị từ chối. Khi máy chủ mất kết nối, ứng dụng giữ dữ liệu phiên và hiển thị nút Thử lại.

Sau khi cập nhật từ câu 1, token cũ chưa có bản ghi phiên nên cần đăng nhập lại một lần. Các tài khoản đã đăng ký vẫn được giữ nguyên. Khởi động lại backend bằng `npm run server` để có các API mới; bật backend trước khi test auto-login.

## Kiểm tra và chụp báo cáo câu 3

1. Home hiển thị danh sách sách từ json-server. Chọn "Lập trình React Native": xem thông tin sách, điểm trung bình 4.5/5 và hai đánh giá mẫu. Component `RatingStars` dùng lại cho điểm trung bình, từng review và chọn sao khi viết đánh giá; hỗ trợ props `value`, `size`.
2. Chưa đăng nhập: chỉ xem được đánh giá và nút Đăng nhập để đánh giá, không có form gửi. Bấm nút này rồi đăng nhập: quay lại đúng cuốn sách.
3. Đã đăng nhập: chọn 1–5 sao, nhập bình luận, bấm Gửi đánh giá. Chưa chọn sao hoặc để trống bình luận thì báo lỗi.
4. Gửi thành công: danh sách thêm ngay đánh giá có tên tài khoản, số sao, bình luận; điểm trung bình và tổng lượt đánh giá thay đổi ngay. Không gọi tải lại sách hoặc tải lại cả trang. Ví dụ hai điểm mẫu 4 và 5, thêm điểm 1 thì trung bình là 3.3/5 với 3 đánh giá.
5. Tải lại hoặc mở lại cuốn sách: đánh giá vẫn còn vì được lưu vào `server/db.json`. Chọn cuốn khác để kiểm tra đánh giá không bị lẫn. Sách chưa có review hiển thị 0.0/5 và "Chưa có đánh giá".

API câu 3: `GET /books`, `GET /books/:id`, `GET /reviews?bookId=:id`; `POST /reviews` nhận `{ bookId, rating, comment }` kèm `Authorization: Bearer <token>`, trả review mới (201). Máy chủ kiểm tra phiên, số sao nguyên 1–5, bình luận không rỗng và sách tồn tại. `userId`, `userName` được lấy từ tài khoản đã xác thực; tên hiển thị dùng phần trước `@` trong email. Không cho ghi đè hoặc xóa review qua các route CRUD mặc định.

Backend chỉ thêm sách và review mẫu khi dữ liệu sách còn trống; giữ nguyên tài khoản và phiên đăng nhập của câu 1–2.

## Sách liên quan

Cuối trang chi tiết có `FlatList horizontal` hiển thị sách cùng `category`, trừ sách đang xem. API dùng `GET /books?category=<danh mục>&id_ne=<id hiện tại>`. Sách mẫu thuộc danh mục Lập trình; backend bổ sung danh mục cho các sách cũ khi khởi động.

Kiểm tra: mở Lập trình React Native, kéo xuống cuối trang: hàng Sách liên quan chỉ có TypeScript cơ bản và JavaScript thực hành. Vuốt ngang rồi chọn một sách để mở trang chi tiết tương ứng. Trang mới phải hiển thị đánh giá và sách liên quan đúng cuốn đó. Nếu không có sách cùng danh mục, hiển thị "Chưa có sách liên quan".
