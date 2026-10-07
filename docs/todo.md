# Todo

Kế hoạch chi tiết và thứ tự thực hiện nằm trong [kế hoạch MVP](mvp-plan.md). Các mục dưới là bản tóm tắt.

## Triển khai MVP

- [x] Khởi tạo Next.js + TypeScript + shadcn/ui.
- [x] Thiết lập theme VSTEPUP và Quicksand, kiểm tra glyph Pinyin.
- [x] Chuyển nội dung 20 câu sang dữ liệu có kiểu.
- [x] Dựng câu hỏi, đáp án, lời giải và màn hoàn thành.
- [x] Logic độc lập: chấm ngay, khóa đáp án, chuyển câu và học lại.
- [x] Kết nối logic học với giao diện (giai đoạn 4).
- [x] Kiểm tra các tiêu chí local trong [nghiệm thu](acceptance.md); bước PR thuộc giai đoạn 6.
- [x] Bổ sung README hướng dẫn chạy/build sau khi có mã nguồn.
- [ ] Hoàn tất cấu hình hosting và runtime Cloudflare; đã xác minh GitHub check read-only, xem [trạng thái triển khai](deployment.md).

## Cân nhắc sau MVP

Đây là backlog để cân nhắc, không phải tính năng đã cam kết hoặc cần triển khai ngay.

| Ý tưởng | Mục đích | Điều cần quyết định |
| --- | --- | --- |
| Tự gõ Pinyin | Kiểm tra khả năng nhớ chủ động | Có chấp nhận không dấu, khoảng trắng và cách viết khác nhau không? |
| Ôn câu sai | Tập trung câu khó nhớ | Ôn ngay trong lượt hay lượt riêng? |
| Lưu tiến độ trên thiết bị | Học tiếp khi quay lại | Lưu những gì, reset thế nào? |
| Thêm câu cá nhân | Sát hội thoại thực tế | Ai kiểm tra Pinyin và nghĩa? |
| Chia chủ đề | Dễ chọn khi số câu tăng | Chỉ cần khi 20 câu không còn đủ |
| Âm thanh/phát âm | Hỗ trợ giao tiếp nói | Người dùng hiện chưa có nhu cầu |
| Sao chép chữ Hán | Thuận tiện gửi tin nhắn | Cân nhắc với mục tiêu tự gõ để nhớ |

Đăng nhập, đồng bộ, SRS, streak, AI sinh bài và gamification chưa có nhu cầu xác nhận; không tự đưa vào MVP.
