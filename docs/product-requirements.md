# Yêu cầu sản phẩm

## Người dùng và mục tiêu

Chỉ một người dùng chính: người Việt chưa biết tiếng Trung, dùng điện thoại và đã cài bàn phím tiếng Trung Pinyin. Người dùng muốn nhắn tin text với người yêu là người Việt biết tiếng Trung. Người dùng xưng “anh”.

Mục tiêu: nhớ Pinyin và nghĩa của câu hằng ngày, từ đó nhập Pinyin trên bàn phím và nhận ra chữ Hán cần chọn. Ưu tiên câu hỏi có/không và thông báo hoạt động như đi làm, làm việc, về nhà, ăn cơm.

Thông tin “giao tiếp công việc” ban đầu đã được làm rõ thành nhắn tin với người yêu. MVP không đặt mục tiêu luyện phát âm, ngữ pháp, chứng chỉ hoặc dạy lý thuyết Mandarin. Pinyin và chữ Hán trong dữ liệu vẫn là tiếng phổ thông, chữ giản thể.

## Yêu cầu đã được người dùng xác nhận

- MVP nhỏ nhất, các tính năng mở rộng ghi vào todo.
- Bài chọn đáp án; tự luyện gõ trong ứng dụng chat bằng bàn phím đã cài.
- Bộ 20 câu do trợ lý đề xuất, theo ngữ cảnh đã nêu.
- Next.js + shadcn/ui.
- Style lấy vstepup.vn làm chuẩn thiết kế.
- Mobile-first; chỉ test mobile web, không quan tâm viewport desktop.

## Phạm vi chức năng

| ID | Yêu cầu |
| --- | --- |
| F01 | Mở trang là thấy câu hỏi đầu tiên, không có bước đăng nhập |
| F02 | Mỗi câu có đúng ba lựa chọn Pinyin có dấu và duy nhất một đáp án đúng |
| F03 | Chạm đáp án chấm ngay; một câu chỉ nhận một lựa chọn |
| F04 | Hiện đúng/sai, đáp án chuẩn, cách gõ không dấu, chữ Hán và nghĩa từ/cụm từ |
| F05 | Người học chủ động bấm tiếp; không tự chuyển câu |
| F06 | Hiển thị vị trí câu và tiến độ trong lượt học hiện tại |
| F07 | Hết 20 câu có thông báo hoàn thành và nút học lại |

## Mặc định triển khai đề xuất

Các điểm này cụ thể hóa MVP, có thể điều chỉnh khi review giao diện:

- Dùng thứ tự câu cố định theo danh sách nội dung để dễ học và kiểm tra.
- Đảo vị trí ba đáp án mỗi khi bắt đầu lượt học; giữ vị trí ổn định trong lượt.
- Tiến độ bằng số câu đã trả lời / 20, không phải điểm số hoặc thống kê dài hạn.
- Không lưu tiến độ: tải lại trang bắt đầu từ câu 1.
- Sau câu cuối, vẫn xem lời giải trước khi bấm “Hoàn thành”.
- Không có điểm tổng, bộ đếm thời gian hoặc áp lực duy trì streak.

## Ngoài phạm vi MVP

Đăng nhập, backend, đồng bộ, lưu lịch sử, luyện gõ, chấm phát âm, âm thanh, thông báo, SRS, chủ đề lựa chọn, bảng xếp hạng, học theo ngày, thanh toán, AI sinh câu, dark mode và cài đặt PWA. Các tính năng có thể cân nhắc nằm trong [todo](todo.md).

## Kết quả mong đợi

Người dùng có thể mở web, hoàn thành vài câu và đọc cách gõ để áp dụng vào tin nhắn. Chọn đúng trên web chỉ kiểm tra nhận diện nghĩa/Pinyin; không được diễn giải thành đã thành thạo tự gõ hoặc phát âm.

## Điều chưa chốt nhưng không chặn MVP

Tên hiển thị chính thức, favicon và cấu hình hosting cuối cùng. Repo trước đây có Cloudflare Workers Builds; cần kiểm tra cấu hình thực tế khi triển khai, không mặc định build mới đã tương thích.
