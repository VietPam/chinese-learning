# Báo cáo giai đoạn 4

Ngày: 2026-10-07. Nhánh: `feat/pinyin-mvp`. Trạng thái: T19–T24 hoàn thành local.

## Đã thực hiện

- Route `/` thay màn chờ bằng PinyinQuiz, nối QuestionCard/SessionComplete với dữ liệu 20 câu và quizReducer.
- Chọn đáp án chấm ngay, khóa cả ba lựa chọn và hiển thị lời giải. Nút tiếp chỉ có sau khi trả lời.
- Thứ tự câu cố định, thứ tự đáp án đảo một lần mỗi lượt; không đổi khi chấm hoặc render lại.
- Giữ lời giải câu 20 trước nút Hoàn thành. Học lại tạo ID lượt mới, tiến độ về 0 và lựa chọn được đảo lại.
- Focus tiêu đề và cuộn tức thì về đầu khi đổi câu, hoàn thành hoặc học lại; không tự cuộn/chuyển câu khi chọn đáp án.
- Vùng aria-live tồn tại trước khi chấm, cập nhật thông báo ngắn sau lựa chọn; không đọc toàn bộ lời giải dài.
- Không lưu lịch sử, reload quay lại câu 1. Không có bước đăng nhập hoặc API chấm bài.

## Khởi tạo và hydration

Server Component dùng connection() để tạo initialSession theo request rồi truyền cùng state đã serialize sang client. Client khởi tạo reducer bằng state này nên HTML ban đầu và hydration có cùng đáp án. Học lại tạo session trong event handler.

Route `/` hiện render theo request và cần Next.js runtime. Không thể static-export nguyên cấu hình này. Cloudflare cần adapter/runtime tương thích khi đến bước hosting; chưa cấu hình hoặc deploy. Không phát sinh database/backend nghiệp vụ.

## Kiểm tra thực tế

| Kiểm tra | Kết quả |
| --- | --- |
| npm run lint | Đạt |
| npm run typecheck | Đạt |
| npm test | 6 test đạt; bổ sung kiểm tra mọi mốc phần trăm |
| npm run build | Đạt |
| Production Chromium touch emulation | 3 lượt × 20 câu ở 360/390/430px, cao 844px |
| Chọn đáp án | Đúng/sai xen kẽ, 3 lựa chọn khóa, nội dung lời giải khớp câu |
| Tiến độ | 0 đến 100%, đúng mỗi mốc 5%; không mất lời giải câu cuối |
| Thao tác lặp | Bấm Next hai lần ở câu dài không bỏ câu |
| Focus/cuộn | Tiêu đề được focus, scrollY=0 sau mỗi chuyển câu và hoàn thành |
| Học lại/reload | Về câu 1, tiến độ 0, không còn lời giải cũ |
| Trạng thái lưu trữ | localStorage và sessionStorage đều trống |
| Mạng trong lượt | Không có fetch/XHR/document request khi học và học lại |
| Hydration và browser | Không console error hoặc uncaught error trong ba lượt |
| Tràn ngang | Không có ở cả ba kích thước qua 20 câu |

Đã sửa số lẻ dấu phẩy động ở 55% và thêm kiểm tra hồi quy. Đã sửa hover còn lưu sau thao tác chạm làm đổi màu đáp án đúng/sai; build lại và kiểm tra riêng trạng thái hover ở 360px: màu cuối đúng #047857 và #B91C1C.

Các thử nghiệm dùng Chromium mobile emulation, không phải Safari/iPhone thật hoặc audit đầy đủ trợ năng. Giai đoạn 5 vẫn là mốc nghiệm thu tổng thể; không đánh dấu toàn bộ checklist giai đoạn 5 hoàn thành chỉ từ kiểm tra tích hợp này.

## Ảnh sản phẩm (không có thanh preview)

- [Chọn đúng — 360px](screenshots/phase-4/correct-360.png)
- [Chọn sai — 360px](screenshots/phase-4/incorrect-360.png)
- [Hoàn thành — 390px](screenshots/phase-4/complete-390.png)

## Bước tiếp theo

Giai đoạn 5: nghiệm thu mobile tổng thể theo acceptance.md, rà soát các mục chưa kiểm tra và ghi nhận giới hạn. Chưa push, tạo PR hoặc deploy.
