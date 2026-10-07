# Báo cáo giai đoạn 2

Ngày: 2026-10-07. Nhánh: `feat/pinyin-mvp`. Trạng thái: T06–T10 hoàn thành local.

## Dữ liệu và rà soát

- `lib/types.ts`: kiểu Phrase readonly, bao gồm câu Việt, Pinyin, dạng gõ, chữ Hán, nghĩa từ và hai ID nhiễu.
- `lib/content.ts`: đủ 20 câu theo thứ tự p01–p20; 10 câu hỏi và 10 câu thông báo.
- Đã rà soát đối chiếu câu Việt/Pinyin/chữ Hán và ngữ cảnh anh/em. Phân biệt đang đi làm với làm việc, đang về với đã về, đang ăn với đã ăn.
- Cập nhật giải nghĩa le trong câu hỏi 5–7 thành “ở đây giúp hỏi việc đã xảy ra chưa”, tránh khiến người học hiểu câu hỏi khẳng định hành động đã hoàn tất.
- Đã rà soát hai distractor mỗi câu: cùng nhóm hỏi/thông báo, khác nghĩa mục tiêu, không dùng cách nói đồng nghĩa làm lựa chọn sai.
- Nội dung được trợ lý rà soát; chưa có kiểm duyệt ngôn ngữ độc lập. Test tự động xác minh cấu trúc/đồng bộ, không chứng minh bản dịch đúng.

## Logic

`lib/quiz.ts` chứa tạo lượt, Fisher–Yates shuffle, reducer và các hàm suy ra tiến độ/đúng sai. Vị trí lựa chọn ổn định trong lượt. Mỗi sự kiện có ID câu và ID lượt; reducer loại bỏ lựa chọn lặp, đáp án không thuộc câu, sự kiện cũ, NEXT khi chưa trả lời và COMPLETE trước câu cuối.

Câu cuối vẫn giữ lựa chọn/lời giải; chỉ COMPLETE chuyển sang hoàn thành. RESET nhận lượt mới được tạo bên ngoài reducer; tiến độ về 0 và thứ tự lựa chọn được tạo lại. Lượt mới có thể tình cờ có một số thứ tự giống lượt cũ; không cam kết ngẫu nhiên luôn khác.

## Kiểm tra thực tế

| Kiểm tra | Kết quả |
| --- | --- |
| npm test | 6 test đạt, không thất bại |
| npm run lint | Đạt, không warning |
| npm run typecheck | Đạt |
| npm run build | Đạt |

Các test bao phủ: 20 ID duy nhất; đủ ba lựa chọn hợp lệ; Pinyin/dạng gõ và từ/chữ Hán nhất quán; khớp tài liệu; đủ 6 hoán vị; đáp án đúng ở cả ba vị trí; bất biến state/dữ liệu; đúng/sai; chặn thao tác lặp/cũ; lượt 20 câu với kết quả xen kẽ; giữ lời giải cuối; hoàn thành và học lại.

Không thêm thư viện test. Dùng Node test runner và TypeScript stripping; nâng yêu cầu Node lên >=22.18.0, cập nhật lockfile và khai báo ES module. Typecheck chạy riêng.

## Giới hạn và bước tiếp

Route `/` vẫn là màn chờ giai đoạn 1. Logic chưa nối với React nên không chạy lại kiểm thử giao diện/mobile cho thay đổi này; các test ở đây kiểm tra dữ liệu và chuyển trạng thái. Chiến lược tránh lệch hydration khi tạo lựa chọn được ghi trong technical-plan.md; cần kiểm tra browser khi ghép UI.

Giai đoạn 3 tiếp theo: theme VSTEPUP, Quicksand và các trạng thái giao diện mobile. Chưa triển khai giai đoạn 3, chưa push hoặc tạo PR.
