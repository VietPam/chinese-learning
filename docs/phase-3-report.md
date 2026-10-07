# Báo cáo giai đoạn 3

Ngày: 2026-10-07. Nhánh: `feat/pinyin-mvp`. Trạng thái: T11–T18 hoàn thành local.

## Giao diện đã dựng

- Theme VSTEPUP: Quicksand, xanh #2455A3, nền trắng chấm mờ, card viền nhẹ radius 24px, lựa chọn radius 14px, badge pastel.
- LearningHeader: tên, icon hội thoại và điểm nhấn trái tim; header gọn có safe-area.
- QuestionCard: nhãn loại câu, vị trí và progress, câu Việt, ba lựa chọn dọc.
- AnswerOption: chạm toàn hàng, tối thiểu 64px, Pinyin 18px; trạng thái idle, đúng, sai và đáp án còn lại; khóa không làm giảm opacity toàn bộ.
- AnswerFeedback và WordMeaningList: thông báo đúng/sai, Pinyin, cách gõ, chữ Hán và giải nghĩa; CTA 48px nằm trong luồng cuộn.
- SessionComplete: thông báo hết 20 câu, nhắc áp dụng và nút học lại.
- Progress truyền value tới Radix để giá trị trợ năng đồng bộ.

Quicksand variable TTF lưu tại app/fonts, lấy từ https://github.com/google/fonts/tree/main/ofl/quicksand, giữ giấy phép OFL. Dùng next/font/local để không phụ thuộc tải font ngoài khi build/truy cập. Font có weight 300–700; tiếng Việt và Pinyin được dùng ở weight 400–700.

## Preview và phạm vi

Chạy `npm run dev`, mở `/design-preview`. Thanh công cụ cuối trang có sáu trạng thái mẫu: câu hỏi, đúng, sai, câu dài, giải thích dài, hoàn thành. Có thể chạm đáp án mẫu để mở lời giải; nút tiếp đưa sang màn hoàn thành mẫu, học lại quay về fixture đầu.

Preview chỉ dành cho phát triển và đã xác minh HTTP 404 ở production. Route `/` vẫn là màn chờ, đã áp dụng header/theme mới. Component nhận props/callback để giai đoạn 4 nối với reducer; đây chưa phải lượt học 20 câu hoàn chỉnh.

## Kiểm tra thực tế

| Kiểm tra | Kết quả |
| --- | --- |
| npm run lint | Đạt |
| npm run typecheck | Đạt |
| npm test | 6 test dữ liệu/logic đạt |
| npm run build | Đạt, font local được đóng gói |
| Chromium mobile touch emulation | 18 trường hợp: 6 trạng thái × 360/390/430px, cao 844px |
| Bố cục | Không tràn ngang, đáp án ban đầu nằm trong màn hình; câu dài xuống dòng |
| Nút | Đáp án tối thiểu 64px; CTA tối thiểu 48px |
| Phản hồi | Ba lựa chọn khóa sau khi trả lời; có nhãn/icon và phần cách gõ |
| Preview interaction | Chạm đáp án → lời giải → hoàn thành mẫu → học lại mẫu đạt |
| Chữ lớn | Thử cỡ chữ gốc 200% với lời giải dài ở 430px: không tràn ngang |
| Reduced motion | Có CSS giảm chuyển động, kiểm tra với emulation |
| Font | Computed font Quicksand, glyph ǐ/ǒ/ǚ/ǜ được Chromium render bằng font web (dạng tổ hợp dấu khi cần); chữ Hán hiện qua font CJK hệ thống |
| Browser errors | Không console error/uncaught error trong kiểm tra preview |
| Production routes | `/` HTTP 200; `/design-preview` HTTP 404 |

Kiểm tra độ tương phản token: primary/trắng 7.23:1; muted/trắng 4.76:1; muted/nền slate 4.55:1; success/nền xanh nhạt 5.21:1; error/nền đỏ nhạt 5.91:1. Chưa thực hiện audit toàn bộ accessibility hoặc test screen reader thực tế.

Đã xem ảnh mobile thực tế và đối chiếu các quy luật từ ảnh VSTEPUP đã khảo sát. Đây không phải bản sao pixel-perfect. Trạng thái đúng/sai vẫn là thiết kế suy ra, chưa xác minh được màn kết quả của VSTEPUP sau đăng nhập.

## Ảnh review

Các ảnh có thanh công cụ preview cuối trang; thanh này không thuộc giao diện sản phẩm.

- [Câu hỏi — 390px](screenshots/phase-3/question-390.png)
- [Chọn sai — 390px](screenshots/phase-3/incorrect-390.png)
- [Lời giải câu dài — 360px](screenshots/phase-3/long-feedback-360.png)
- [Hoàn thành — 390px](screenshots/phase-3/complete-390.png)

## Giới hạn và bước tiếp

Chỉ kiểm tra mobile web giả lập Chromium; chưa test Safari/iPhone thật. Không test viewport desktop. Giai đoạn 4 sẽ ghép dữ liệu/state, xử lý focus/cuộn giữa câu, rồi kiểm tra hydration và lượt đầy đủ. Chưa push, tạo PR hoặc deploy giai đoạn này.
