# Tinh gọn không gian học — 08/10/2026

Theo feedback ảnh production, ưu tiên nội dung học và loại bỏ dòng dẫn/trang trí lặp lại.

- Bỏ logo/tên ở header. Gộp hai nút mũi tên và `Câu n/20` trong một hàng cao tối thiểu 52px; vùng chạm 44px. Giữ tên truy cập cho nút chỉ có icon.
- Bỏ ba dòng giới thiệu từng mục, “Học từng từ trong câu”, “Gõ cả câu bằng chữ Hán”, “Câu này nói thế nào?” và lời nhắc dưới đáp án.
- Mục Học bỏ thẻ ngoài lồng thẻ trong: Việt/Pinyin/Hán/cách gõ cùng một khối, dùng hết chiều rộng còn lại sau lề 12px.
- Danh sách từ chuyển thành bảng ba cột Pinyin/Hán/Nghĩa, giảm khoảng đệm hàng, bỏ tiêu đề khẩu hiệu “Từng từ, dễ nhớ hơn”. Không bỏ nghĩa từ hoặc chú thích kiến thức.
- Quiz và Luyện gõ giảm padding thẻ còn 14px, giữ cỡ chữ và vùng chạm đáp án.
- Rút gọn lời báo đúng/sai, hướng dẫn Enter và màn hình hoàn thành. Giữ thông tin giúp thao tác, không thêm mô tả mới.
- Giữ bottom bar SVG, trạng thái phiên, xáo câu, IME và các quy tắc chấm.

Nghiệm thu: bộ test mobile 360/390/430px, chữ 200%, luồng đầy đủ ba mục; kiểm tra thêm bảng từ câu đầu nằm trên bottom bar ở chiều cao nội dung 640px (gần không gian còn lại khi trình duyệt điện thoại hiện thanh công cụ).

Quyết định trong tài liệu này thay thế phần header, thẻ và mô tả tương ứng trong các tài liệu thiết kế trước.

Kết quả: lint/typecheck/build Worker đạt, 8 unit tests và 12 mobile E2E tests đạt. Kiểm tra bổ sung chiều cao 640px đạt ở cả ba chiều rộng; câu đầu hiển thị đủ bảng từ phía trên bottom bar. Đã xem ảnh thực tế: [Học ở 360 × 640](screenshots/compact-layout/learn-360x640.png).
