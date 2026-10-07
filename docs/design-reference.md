# Thiết kế MVP Pinyin theo VSTEPUP

> Cập nhật sau feedback production: [Tinh gọn mobile và tham chiếu cả hai website](mobile-design-refinement.md). Các quyết định mới về header, nhãn và khẩu hiệu thay thế bố cục tương ứng bên dưới.

Khảo sát trực tiếp ngày 2026-10-07 bằng Chromium, viewport desktop 1440×1000 và mobile 390×844. Đây là đặc tả thiết kế trước khi triển khai Next.js + shadcn/ui.

Yêu cầu cập nhật: sản phẩm mobile-first; chỉ thiết kế và kiểm tra giao diện mobile web. Viewport nghiệm thu: 360, 390 và 430px. Quan sát desktop bên dưới chỉ là tư liệu khảo sát VSTEPUP, không phải yêu cầu triển khai hoặc kiểm thử.

## Phạm vi và nguồn

- https://vstepup.vn/ — điều hướng, card, CTA, badge, bộ lọc, bố cục responsive.
- https://vstepup.vn/tools/vocab — danh sách bộ từ, trạng thái, progress, bố cục hai cột.
- https://vstepup.vn/lo-trinh — phân cấp nội dung, lựa chọn lộ trình, bảng so sánh.
- https://vstepup.vn/luyen-tap-vstep/reading-test-11-part-1 — khung làm bài, câu hỏi, lựa chọn, thanh thao tác.

Đã xem ảnh desktop/mobile của trang chủ, từ vựng và bài Reading, cùng DOM/CSS của cả bốn trang. Màn hình Reading có modal đăng nhập; chưa xác minh luồng nộp bài hoặc giao diện kết quả. Không suy diễn rằng trạng thái đúng/sai bên dưới là hành vi đã quan sát trên VSTEPUP.

## Quy luật quan sát được

1. Quicksand là font giao diện; chữ tròn, thân thiện. Điều hướng 14px/600, tiêu đề card thường 14–18px/600–800. Nội dung Reading khoảng 16px.
2. CTA ở trang chủ/từ vựng dùng #2455A3, chữ trắng. Một số màn hình dùng biến thể xanh khác; không phải mọi màu xanh đều là một token.
3. Nền trang sáng có chấm nhỏ mờ; nội dung đặt trong bề mặt trắng, viền xanh xám nhạt. Shadow ít và nhẹ.
4. Bo góc phân cấp: filter khoảng 10px; button/input/nested card khoảng 14px; panel 16–24px. Các card lớn trang chủ có thể bo rộng hơn.
5. Card có nhịp: icon hoặc badge nhỏ → tiêu đề → mô tả phụ → metadata/CTA. Các đường chia rất nhẹ giúp nhóm thông tin.
6. Header trắng, sticky, viền dưới; desktop có nhãn điều hướng, mobile thu về logo và các nút ngắn/menu.
7. Desktop dùng khung nội dung khoảng 1216px tại viewport 1440px; danh sách từ vựng hai cột. Mobile xếp dọc và lề hẹp.
8. Trạng thái active dùng nền xanh nhạt hoặc xanh đậm tùy vai trò. Badge pastel biểu đạt trạng thái; icon/emoji và minh họa mềm tạo cảm giác thân thiện.
9. Màn hình Reading: passage và câu hỏi chia hai cột trên desktop, xếp dọc trên mobile; câu hỏi đặt trong vùng nền nhạt, card trắng viền nét đứt; thanh điều hướng câu và thao tác ở phía dưới.
10. Trang chủ có minh họa 3D pastel, nhưng màn hình bài tập tập trung vào chữ. MVP dùng icon nhỏ là đủ để giữ nhịp thị giác.

## Token triển khai đề xuất

Các giá trị ghi “đo được” lấy từ computed style; giá trị còn lại là chuẩn hóa cho MVP, không khẳng định là token gốc của VSTEPUP.

| Token | Giá trị | Cơ sở |
| --- | --- | --- |
| primary | #2455A3 | Đo được trên CTA |
| primary-foreground | #FFFFFF | Đo được |
| font-ui | Quicksand, sans-serif | Đo được |
| background / surface | #FFFFFF | Quan sát/đo được bề mặt |
| muted | #F8FAFC | Chuẩn hóa từ nền slate nhạt |
| primary-soft | #EFF6FF | Chuẩn hóa từ trạng thái xanh nhạt |
| foreground | #17233B | Đề xuất, chữ xanh đen |
| muted-foreground | #64748B | Đề xuất, đảm bảo dễ đọc hơn chữ phụ quá nhạt |
| border | #E2E8F0 | Đề xuất, viền xanh xám nhạt |
| success / success-soft | #047857 / #ECFDF5 | Đề xuất cho kết quả đúng |
| error / error-soft | #B91C1C / #FEF2F2 | Đề xuất cho kết quả sai |
| radius | 10 / 14 / 16 / 24px | Các mức quan sát được |
| spacing | 4 / 8 / 12 / 16 / 24 / 32px | Chuẩn hóa nhịp khoảng cách |

Font tiếng Việt dùng Quicksand lưu local qua next/font/local, kèm giấy phép OFL trong app/fonts; cần kiểm tra glyph Pinyin ǐ, ǒ, ǚ, ǜ ở trình duyệt. Chữ Hán dùng font hệ thống hỗ trợ CJK. Không ép font thiếu glyph.

## Chuyển sang MVP

Một trang học, gồm trạng thái câu hỏi, kết quả và hoàn thành. Vào web thấy ngay câu đầu; không cần trang marketing hoặc chọn khóa học.

- Header trắng cao khoảng 60–64px, tên sản phẩm và nhãn nhỏ “20 câu mỗi ngày” không dùng vì chưa có lịch học; dùng “20 câu nhắn tin”.
- Khung học một cột theo chiều rộng điện thoại, lề 16px. Bố cục được thiết kế từ viewport 360px và kiểm tra thêm 390/430px.
- Card chính trắng bo 24px, viền nhạt; padding 20px trên mobile.
- Dòng trên: badge loại câu (Hỏi em / Báo cho em), “Câu 1/20” và progress của lượt hiện tại.
- Câu tiếng Việt 24–28px; Pinyin ở lựa chọn 18–20px, line-height ít nhất 1.5.
- Ba đáp án xếp dọc, mỗi đáp án là một button rộng toàn hàng, cao tối thiểu 56px, tự giãn với câu dài; ký hiệu A/B/C trong ô nhỏ. Button semantics vì bấm là chấm ngay.
- Sau khi chọn, khóa lựa chọn của câu hiện tại, hiển thị đúng/sai bằng chữ + icon + màu. Không tự chuyển câu.
- Phần giải thích nằm ngay dưới đáp án: Pinyin có dấu → dạng không dấu để gõ → chữ Hán → nghĩa từng từ. Dùng hàng/chip có nhãn rõ, tự xuống dòng.
- Nút “Câu tiếp theo” xanh #2455A3, rộng toàn hàng trên mobile, cao 48px. Chỉ xuất hiện sau khi trả lời. Nếu dùng sticky bottom, có safe-area và padding nội dung để không che lời giải.
- Kết thúc 20 câu: card ngắn “Bạn đã học hết 20 câu”, nút “Học lại”. Không cần chấm điểm tổng kết.
- Tôn trọng reduced motion; focus ring rõ; aria-live polite cho phản hồi; contrast tối thiểu 4.5:1 cho chữ thường. Nội dung cuộn tự nhiên, không tạo hai vùng cuộn riêng trên điện thoại.

## Use case và tiêu chí nghiệm thu

| Use case | Tham chiếu VSTEPUP | Áp dụng / hành vi cần kiểm tra |
| --- | --- | --- |
| Mở web để học nhanh | Card có tiêu đề, mô tả, metadata rõ | Thấy câu đầu và 3 đáp án ngay ở mobile; không có bước đăng nhập |
| Đọc câu và chọn Pinyin | Vùng câu hỏi Reading, lựa chọn xếp dọc | Một lần chạm chấm một câu; không chạm nhầm khi đáp án dài |
| Chọn đúng | Suy ra từ hệ badge/card pastel, chưa xem kết quả gốc | Đáp án đúng xanh lá, nhãn “Đúng rồi”, lời giải và CTA tiếp tục |
| Chọn sai | Suy ra, chưa xem kết quả gốc | Đánh dấu lựa chọn sai và đáp án đúng, giải thích ngắn, không tự chuyển |
| Chuẩn bị gõ trong chat | Mẫu nội dung trong card và phân cấp typography | Ví dụ: wǒ zài chīfàn → wo zai chifan → 我在吃饭; các từ có nghĩa tiếng Việt |
| Sang câu kế | Thanh thao tác làm bài có CTA rõ | Xóa trạng thái câu cũ, cập nhật câu/progress; không nhận click lặp |
| Hoàn thành | Suy ra từ card trạng thái | Hiện hoàn thành sau câu 20, “Học lại” bắt đầu lượt mới |
| Dùng màn hình nhỏ | Header rút gọn, layout xếp dọc | Kiểm tra 360/390/430px; không tràn ngang, không che CTA hoặc lời giải |

## Next.js + shadcn/ui

- Next.js App Router, TypeScript; một route học với client component giữ trạng thái lượt học.
- Dữ liệu 20 câu tĩnh. State chỉ cần questionIndex và selectedAnswer; tiến độ chỉ trong lượt hiện tại.
- shadcn/ui: Button, Card, Badge, Progress, Separator. AnswerOption là component riêng dựa trên button.
- Theme override bằng CSS variables; chỉnh font, radius, border, primary trước khi dựng màn hình. Không coi theme mặc định shadcn là thiết kế cuối.
- Các component: LearningHeader, QuestionCard, AnswerOption, AnswerFeedback, WordMeaningList, SessionComplete.
- Ánh xạ theme đồng nhất cho hover/focus/disabled và đúng/sai. Tránh giảm opacity cả đáp án đã khóa khiến Pinyin khó đọc.

## Phạm vi và todo

MVP: 20 câu, 3 lựa chọn, phản hồi ngay, Pinyin có dấu/không dấu, chữ Hán và nghĩa từ, câu tiếp theo, học lại.

Todo: tự gõ, ôn câu sai, lưu tiến độ, thêm câu cá nhân, chia chủ đề, âm thanh. Các mẫu bảng xếp hạng, đăng nhập, SRS, Pro, quảng cáo nổi và bộ lọc thư viện quan sát được ở VSTEPUP không thuộc nhu cầu MVP đã thống nhất.

## Cách kiểm tra độ giống khi triển khai

Chỉ kiểm tra mobile web ở viewport 360/390/430px; không có yêu cầu kiểm thử hoặc tối ưu viewport desktop. So sánh cùng viewport mobile với ảnh tham chiếu: font và độ đậm; CTA xanh; viền/shadow; bo góc; nền chấm; khoảng cách; phân cấp tiêu đề–mô tả–metadata. Sau đó kiểm tra riêng câu dài, Pinyin đủ dấu, kết quả đúng/sai và khả năng chạm bằng ngón tay. Style lấy VSTEPUP làm nguồn tham chiếu; hành vi vẫn phục vụ học Pinyin của người dùng.

## Hiện thực giai đoạn 3

Đã dựng component trình bày và preview development `/design-preview`. Quicksand variable weight 300–700 được tải từ google/fonts, lưu cùng repo; build không cần fetch font từ Google. Lời giải dùng font hệ thống hỗ trợ CJK cho chữ Hán. Các glyph Pinyin ǐ/ǒ/ǚ/ǜ đã được kiểm tra ở Chromium (browser tạo tổ hợp dấu cho glyph không có dạng dựng sẵn).

Mobile dùng CTA trong luồng tài liệu, không sticky; header sticky có safe-area. Nền chấm 16px, card radius 24px, option radius 14px; đáp án tối thiểu 64px (cao hơn mức yêu cầu 56px), CTA 48px. Progress truyền value tới Radix để aria-valuenow khớp thanh hiển thị.

Các component nhận props/callback; preview dùng fixture xác định để review hình thức. Chưa kết nối reducer cho luồng 20 câu. Ảnh và giới hạn kiểm tra nằm trong [báo cáo giai đoạn 3](phase-3-report.md).
