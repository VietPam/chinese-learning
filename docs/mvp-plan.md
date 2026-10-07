# Kế hoạch triển khai MVP

Cập nhật: 2026-10-07. Trạng thái: giai đoạn 1–5 hoàn thành; giai đoạn 6 bàn giao PR, T36 hosting còn mở.

## 1. Đích bàn giao

Một mobile web dùng Next.js + shadcn/ui, mở ra học ngay 20 câu nhắn tin với người yêu. Mỗi lượt: đọc câu tiếng Việt → chọn một trong ba Pinyin → xem đúng/sai và lời giải → chủ động sang câu tiếp. Sau câu cuối, có màn hoàn thành và học lại.

Style lấy VSTEPUP làm chuẩn theo [đặc tả thiết kế](design-reference.md). Nghiệm thu chỉ trên mobile web 360, 390, 430px; không có yêu cầu desktop.

Bản MVP gồm một route `/`, ba trạng thái chính (câu hỏi, phản hồi, hoàn thành), dữ liệu tĩnh và state trong lượt. Không cần tài khoản hoặc dịch vụ bên ngoài để học.

## 2. Giới hạn phạm vi

| Có trong MVP | Để sau MVP |
| --- | --- |
| 20 câu có sẵn, xưng anh/em | Thêm/sửa câu bằng giao diện |
| Ba đáp án, chấm ngay | Bài tự gõ, âm thanh, phát âm |
| Pinyin có dấu, dạng gõ, chữ Hán, nghĩa từ | AI sinh nội dung, bài ngữ pháp |
| Vị trí câu và tiến độ lượt hiện tại | Lưu tiến độ, ôn câu sai, SRS, streak |
| Học lại bộ câu | Chọn chủ đề, chọn độ khó |
| Mobile web theo VSTEPUP | Dashboard, đăng nhập, backend, thanh toán |

Không đưa tính năng trong backlog vào giữa quá trình triển khai nếu chưa có yêu cầu mới. Không cần trang giới thiệu, danh mục khóa học hoặc trang cài đặt để hoàn thành luồng chính.

## 3. Mặc định để triển khai không bị bỏ ngỏ

- Thứ tự câu cố định p01–p20 theo [nội dung](content.md).
- Đảo vị trí đáp án một lần khi bắt đầu lượt; không thay đổi khi render lại hoặc chấm câu.
- Chạm là chấm, không có nút “Kiểm tra” trung gian.
- Chọn xong khóa đáp án; lời giải mở trong trang, không dùng modal.
- Chưa trả lời không hiện nút tiếp; câu cuối dùng nút “Hoàn thành”.
- Tiến độ tăng theo câu đã trả lời: 0/20 → 20/20. Không có điểm số tổng kết.
- Reload bắt đầu lại; chưa dùng localStorage.
- Nút tiếp nằm trong luồng trang, rộng toàn hàng. Chỉ cân nhắc sticky nếu thử trên mobile cho thấy cần thiết và không che lời giải.
- Tên hiển thị tạm “Pinyin mỗi ngày”, nhãn “20 câu nhắn tin”; tên có thể đổi trong một hằng số. Tên không kéo theo tính năng lịch học.

Đây là các mặc định kỹ thuật/UX đề xuất để cụ thể hóa phạm vi đã chốt, không phải tính năng bổ sung.

## 4. Giai đoạn và đầu việc

### Giai đoạn 1 — Nền tảng chạy được

Phụ thuộc: tài liệu hiện tại.

- [x] T01. Kiểm tra repo sạch về mã nguồn, tạo nhánh `feat/pinyin-mvp`, giữ toàn bộ tài liệu hiện có.
- [x] T02. Khởi tạo Next.js App Router, TypeScript, Tailwind và lockfile bằng một package manager thống nhất.
- [x] T03. Cài và cấu hình shadcn/ui; chỉ thêm Button, Card, Badge, Progress, Separator.
- [x] T04. Tạo route `/`, layout tiếng Việt, metadata cơ bản và viewport mobile.
- [x] T05. Thêm lệnh dev, build, typecheck, lint phù hợp phiên bản thực tế.

Đầu ra: ứng dụng tối thiểu chạy local, build được. Không thêm thư viện state toàn cục hoặc backend.

Điều kiện hoàn thành: build/typecheck chạy thành công và route `/` mở được.

### Giai đoạn 2 — Nội dung và logic học

Phụ thuộc: giai đoạn 1.

- [x] T06. Tạo type Phrase, chuyển đủ p01–p20 từ Markdown sang dữ liệu có kiểu.
- [x] T07. Rà soát từng câu: nghĩa Việt, dấu thanh, chữ Hán, dạng gõ, nghĩa từ và hai đáp án nhiễu.
- [x] T08. Viết hàm tạo ba lựa chọn theo ID và đảo thứ tự; không để random gây lệch hydration.
- [x] T09. Viết logic chọn đáp án, chuyển câu, hoàn thành và reset. Có thể dùng reducer nhỏ để kiểm soát chuyển trạng thái.
- [x] T10. Viết kiểm tra dữ liệu và kiểm tra logic có ý nghĩa: chọn lặp, NEXT trước khi chọn, câu cuối, reset.

Đầu ra: bộ 20 câu và logic học độc lập với giao diện.

Điều kiện hoàn thành: mỗi câu có đúng ba lựa chọn duy nhất, một đáp án đúng; không bỏ qua câu do double-tap; không hoàn thành trước khi trả lời câu 20.

Lưu ý: tự kiểm tra cấu trúc không thay thế rà soát ngôn ngữ. Ghi rõ mức độ kiểm tra nội dung thực tế, không khẳng định đã được giáo viên duyệt.

### Giai đoạn 3 — Giao diện mobile theo VSTEPUP

Phụ thuộc: giai đoạn 1; dùng một câu mẫu từ giai đoạn 2.

- [x] T11. Thiết lập CSS variables: xanh #2455A3, nền trắng, viền nhạt, màu chữ, đúng/sai và radius 14/24px.
- [x] T12. Cài Quicksand, font fallback cho Pinyin/CJK; kiểm tra tiếng Việt và glyph có dấu.
- [x] T13. Dựng header gọn, nền chấm mờ, khung một cột lề 16px.
- [x] T14. Dựng QuestionCard: loại câu, Câu n/20, progress và câu tiếng Việt.
- [x] T15. Dựng AnswerOption: ba hàng toàn chiều rộng, nhãn A/B/C, Pinyin 18–20px, cao tối thiểu 56px.
- [x] T16. Dựng hai trạng thái phản hồi: đúng/sai bằng màu + chữ + icon; không làm chữ đáp án đã khóa quá mờ.
- [x] T17. Dựng lời giải: Pinyin chuẩn → dạng gõ → chữ Hán → nghĩa từng từ; CTA cao tối thiểu 48px.
- [x] T18. Dựng SessionComplete và nút Học lại.

Đầu ra: đủ trạng thái để kiểm tra hình thức trên mobile, kể cả câu 11/13 dài.

Điều kiện hoàn thành: không tràn ngang ở 360px; màu, font, viền, bo góc và khoảng cách theo tài liệu tham chiếu; câu dài tự xuống dòng.

Mẫu đúng/sai là thiết kế suy ra cho MVP; chưa có bằng chứng đây là màn kết quả thực tế của VSTEPUP.

### Giai đoạn 4 — Ghép thành luồng dùng được

Phụ thuộc: giai đoạn 2 và 3.

- [x] T19. Kết nối dữ liệu/state với toàn bộ component, render câu đầu ngay khi sẵn sàng.
- [x] T20. Khóa lựa chọn sau khi chấm, giữ lời giải đến khi người dùng bấm tiếp.
- [x] T21. Cập nhật vị trí và tiến độ chính xác; đưa câu mới vào tầm nhìn khi lời giải trước đã cuộn dài.
- [x] T22. Hoàn thiện câu cuối → lời giải → Hoàn thành → Học lại.
- [x] T23. Thêm aria-live cho phản hồi, focus hợp lý khi chuyển trạng thái và hỗ trợ reduced motion.
- [x] T24. Kiểm tra reload bắt đầu lại, không có yêu cầu đăng nhập hoặc API chấm bài.

Đầu ra: một lượt học đầy đủ từ câu 1 đến câu 20 chạy được trên điện thoại mô phỏng.

Điều kiện hoàn thành: không có luồng cụt, không hiện lời giải câu trước trong câu mới, không đổi đáp án đã chọn và không bỏ qua câu.

### Giai đoạn 5 — Nghiệm thu mobile

Phụ thuộc: giai đoạn 4.

- [x] T25. Chạy build, typecheck, lint và kiểm tra logic/dữ liệu.
- [x] T26. Browser test luồng đầy đủ: có cả câu chọn đúng/sai, đi hết 20 câu và học lại.
- [x] T27. Kiểm tra giao diện 360×800, 390×844, 430×932 ở trạng thái đầu, đúng, sai, câu dài, hoàn thành.
- [x] T28. Kiểm tra touch/double-tap, cuộn sau lời giải dài, reload và nhấn lặp CTA.
- [x] T29. Chụp ảnh mobile so sánh với VSTEPUP theo font, màu xanh, card, viền, nền và khoảng cách.
- [x] T30. Kiểm tra contrast, zoom chữ, focus, dấu Pinyin, chữ Hán, lỗi console/hydration.
- [x] T31. Sửa lỗi phát hiện; chạy lại phần bị ảnh hưởng và luồng chính khi cần.

Đầu ra: bản chạy local đã kiểm tra, ảnh mobile và báo cáo kết quả ngắn.

Điều kiện hoàn thành: các mục áp dụng trong [checklist nghiệm thu](acceptance.md) đạt; mọi giới hạn kiểm tra được ghi rõ. Không gọi browser emulation là đã kiểm thử iPhone thật. Không có vòng kiểm thử desktop.

### Giai đoạn 6 — Chuẩn bị bàn giao và triển khai

Phụ thuộc: giai đoạn 5.

- [x] T32. Cập nhật README bằng lệnh cài đặt/chạy/build thực tế và hành vi reset khi reload.
- [x] T33. Đồng bộ các thay đổi thiết kế hoặc nội dung ngược vào tài liệu.
- [x] T34. Chuẩn bị commit và mô tả PR: vấn đề, hành vi mới, phạm vi, kiểm tra và ảnh mobile.
- [x] T35. Khi đưa lên GitHub, kiểm tra diff chỉ chứa tài liệu, ứng dụng và cấu hình cần thiết.
- [ ] T36. Khi triển khai hosting, đọc cấu hình Cloudflare hiện tại rồi chọn phương án build/export/adapter phù hợp; kiểm tra bằng URL thật.

Đầu ra: mã nguồn và tài liệu có thể review; build artifact sẵn sàng cho môi trường hosting đã xác minh.

Người dùng đã yêu cầu tiếp tục giai đoạn 6 để bàn giao PR. Merge PR tính năng và phát hành hosting chưa được thực hiện. T36 còn mở theo báo cáo giai đoạn 6.

## 5. Kiểm thử ưu tiên

| Mức | Trường hợp | Lý do |
| --- | --- | --- |
| Bắt buộc | Chấm theo ID khi đảo đáp án | Tránh chấm sai do dựa vào A/B/C |
| Bắt buộc | Chọn lặp và double-tap Next | Tránh đổi kết quả hoặc bỏ câu |
| Bắt buộc | Câu 20, Hoàn thành, Học lại | Tránh lỗi vượt index và mất lời giải cuối |
| Bắt buộc | Câu 11/13 ở 360px | Nội dung dài dễ tràn/cắt dấu |
| Bắt buộc | Đúng/sai có chữ và icon | Có thể hiểu trạng thái ngoài màu sắc |
| Bắt buộc | Dữ liệu 20 câu nhất quán | Đây là giá trị cốt lõi của sản phẩm |
| Bắt buộc | Hydration và build production | Tránh local dev chạy nhưng bản build lỗi |

Không viết test chỉ để kiểm tra class Tailwind hoặc lặp lại cấu trúc component. Test logic chuyển trạng thái, tính hợp lệ dữ liệu và hành vi người dùng.

## 6. Điểm review cụ thể

1. Sau giai đoạn 3: review ảnh mobile câu ngắn/câu dài và phản hồi để đánh giá style VSTEPUP.
2. Sau giai đoạn 4: review một lượt học hoạt động đầy đủ.
3. Sau giai đoạn 5: review diff, kết quả kiểm tra và các giới hạn trước khi phát hành.

Đây là mốc đưa kết quả ra xem, không phải yêu cầu dừng xin xác nhận cho từng đầu việc thông thường.

## 7. Definition of Done

- Đủ F01–F07 trong [yêu cầu sản phẩm](product-requirements.md).
- Đủ 20 câu và lời giải, không mở rộng sang backlog.
- Luồng mở trang → học → hoàn thành → học lại hoạt động.
- Mobile 360/390/430px đã được kiểm tra; giao diện theo VSTEPUP.
- Build/typecheck và các kiểm tra cần thiết đạt; không còn lỗi chặn sử dụng.
- README, tài liệu nội dung và báo cáo kiểm tra khớp với mã nguồn.
- Trạng thái bàn giao được ghi chính xác: local, PR hay URL đã deploy; không coi tạo PR là đã phát hành.
