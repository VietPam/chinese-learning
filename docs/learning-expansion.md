# Học · Quiz · Luyện gõ

Yêu cầu chốt ngày 07/10/2026. Tài liệu này thay thế các giới hạn cũ về thứ tự quiz và chưa hỗ trợ luyện gõ.

## Phạm vi

- Ba mục ở bottom bar có SVG riêng lấy cảm hứng thumbnail VSTEP Việt: chủ thể rõ, nét tròn, nền pastel; có nhãn chữ và trạng thái chọn.
- Học: theo thứ tự 20 câu, nghĩa tiếng Việt, Pinyin, chữ Hán, cách gõ không dấu và danh sách từ của câu. Trước/sau, không chấm điểm.
- Quiz: tự xáo 20 câu và ba đáp án khi tạo lượt; giữ nguyên thứ tự trong lượt. Trước/sau cho phép bỏ qua; câu đã trả lời giữ đáp án/lời giải và khóa lựa chọn. Tiến độ tính số câu đã trả lời, không tính vị trí. Cuối lượt cho làm câu còn thiếu; chỉ hoàn thành khi đủ 20.
- Luyện gõ: cả câu, theo thứ tự cố định; hiện nghĩa tiếng Việt và Pinyin có dấu/không dấu. Người học dùng bàn phím Trung iPhone chọn chữ Hán rồi Enter để chấm. Enter trong lúc composition hoặc dùng để chốt composition không nộp. Web chỉ nhận văn bản cuối cùng, không truy cập gợi ý của bàn phím.
- Chấm đúng chuỗi chữ Hán mẫu sau khi bỏ khoảng trắng và dấu câu; không chấp nhận câu đồng nghĩa khác hoặc Pinyin thay chữ Hán. Không chấm input trống thành đúng. Không tự sửa chữ nhập.
- Sai: hiện câu đúng, giữ bài nhập, sửa và nộp lại không giới hạn. Đúng: giữ kết quả; bấm phải để tiếp tục. Trái/phải giữ bài nhập và kết quả riêng từng câu.
- Chuyển mục giữ trạng thái trong phiên React hiện tại. Tải lại bắt đầu mới. Mặc định mở Quiz để giữ lối vào hiện tại.
- Bottom bar có safe-area iPhone; khi ô gõ focus, ẩn bar để ưu tiên bàn phím và bài nhập. Blur hiện lại.

## Các bước triển khai

1. State: thứ tự câu, đáp án theo ID, vị trí riêng từng mục, draft luyện gõ theo ID; unit test shuffle/bỏ qua/quay lại/chấm.
2. UI: bottom bar, danh sách từ, điều hướng hai chiều; tái sử dụng thành phần hiện có.
3. Quiz: missing review và completion có điều kiện; chống sự kiện cũ/double-tap qua question/session context.
4. Typing: controlled input, composition guard và Enter, phản hồi không tự chuyển.
5. Nghiệm thu: build Worker, lint/typecheck/unit; E2E ba viewport 360/390/430, accessibility, chữ 200%, giữ state, full quiz và composition; triển khai production và smoke test.

## Ngoài phạm vi

Không thêm nội dung, âm thanh, tài khoản, điểm số, lưu sau reload. Chỉ mobile; không test desktop. Chromium mobile mô phỏng composition không thay thế kiểm chứng bàn phím Trung trên iPhone thật; ghi rõ giới hạn nghiệm thu này khi bàn giao.

## Kết quả nghiệm thu trước phát hành

Lint/typecheck đạt, 8/8 unit tests và 12/12 E2E tests đạt; bundle Cloudflare Worker build thành công. Đã xem ảnh mobile các màn hình và trạng thái chữ lớn. E2E xác nhận bỏ qua/quay lại, đủ 20 câu mới hoàn thành, state riêng từng mục, Enter/IME mô phỏng, sửa câu sai, dấu câu/khoảng trắng, reload reset và route preview 404.

Ảnh 390px: [Học](screenshots/learning-expansion/learn-390.png) · [Quiz](screenshots/learning-expansion/quiz-390.png) · [Luyện gõ](screenshots/learning-expansion/typing-390.png).

Cần kiểm chứng bổ sung trên iPhone thật: bật bàn phím Trung giản thể/Pinyin, gõ một câu, dùng Enter chốt ứng viên không chấm sớm, Enter/Xong tiếp theo chấm, mở/đóng bàn phím không che ô nhập. Chưa đánh dấu đạt bước này bằng test mô phỏng.
