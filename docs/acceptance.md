# Checklist nghiệm thu MVP

> Cập nhật 07/10/2026: [Học · Quiz · Luyện gõ](learning-expansion.md) thay thế các mô tả cũ về quiz theo thứ tự, không bỏ qua/quay lại và chưa có luyện gõ.
Trạng thái: đã nghiệm thu local ngày 2026-10-07 trên Chromium mobile emulation. Chi tiết, ảnh và giới hạn ở [báo cáo giai đoạn 5](phase-5-report.md). Nội dung ngôn ngữ do trợ lý rà soát, chưa kiểm duyệt độc lập.

## Chức năng

- [x] Mở trang thấy câu đầu và ba đáp án, không đăng nhập.
- [x] Có đúng 20 câu; mỗi câu chỉ có một đáp án đúng.
- [x] Chọn đúng và sai đều hiện đủ lời giải.
- [x] Chọn xong khóa đáp án; click lặp không thay đổi kết quả.
- [x] Không tự chuyển câu; chưa trả lời không được sang câu tiếp.
- [x] Chuyển câu xóa kết quả cũ; double-tap không bỏ qua câu.
- [x] Tiến độ tăng sau mỗi câu trả lời, từ 0 đến 20.
- [x] Câu cuối vẫn có lời giải trước khi bấm “Hoàn thành”.
- [x] Học lại reset toàn bộ lượt; reload bắt đầu từ đầu.

## Nội dung

- [x] ID duy nhất, mọi distractor tồn tại, không trùng nhau hoặc đáp án chính.
- [x] Câu Việt/Pinyin/chữ Hán thống nhất nghĩa.
- [x] Phân biệt “trên đường đi làm”, “làm việc”, “tan làm”.
- [x] “Anh/em” trong tiếng Việt được giải thích theo vai trò wǒ/nǐ.
- [x] Dạng gõ không có dấu thanh; Pinyin hiển thị có dấu đầy đủ.
- [x] Lời giải từ/cụm từ ngắn, không biến thành bài ngữ pháp dài.
- [x] Chọn đúng qua ID, không phụ thuộc vị trí A/B/C.

## Mobile web

Chỉ nghiệm thu viewport điện thoại. Bộ kích thước đề xuất: 360×800, 390×844, 430×932. Browser automation mô phỏng mobile phải bật touch phù hợp; nếu chưa test Safari/iPhone thật thì ghi rõ giới hạn, không gọi emulation là test thiết bị thật.

- [x] Không tràn ngang ở cả ba kích thước.
- [x] Câu 11/13 dài tự xuống dòng, không cắt chữ hoặc bóp nút.
- [x] Pinyin và dấu thanh không bị mất glyph/cắt ở đầu dòng.
- [x] Câu ngắn ban đầu thấy cả ba lựa chọn; câu dài có thể cuộn tự nhiên.
- [x] Đáp án cao tối thiểu 56px; CTA cao tối thiểu 48px.
- [x] Header/CTA không che lời giải; nếu sticky thì xử lý safe-area và phần bù nội dung.
- [x] Khi đổi câu, câu mới nằm trong tầm nhìn dù lời giải trước dài.
- [x] Phản hồi có chữ/icon ngoài màu; chữ thường đạt tương phản 4.5:1.
- [x] Zoom chữ và reduced motion không làm mất nội dung/chặn thao tác.
- [x] So sánh ảnh mobile VSTEPUP: Quicksand, xanh #2455A3, viền nhẹ, bo góc, khoảng cách và nền chấm.

## Kỹ thuật

- [x] Build và typecheck thành công.
- [x] Kiểm tra dữ liệu và state transitions cho đúng/sai, câu cuối, học lại.
- [x] Browser flow từ đầu đến hết 20 câu; không lỗi console/hydration.
- [x] Đánh giá đúng/sai chạy tại client, không cần API.
- [x] Ghi rõ lệnh kiểm tra và kết quả thực tế trong phần bàn giao PR (giai đoạn 6).
