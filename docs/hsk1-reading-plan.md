# Luyện Đọc HSK 1

Yêu cầu chốt qua phỏng vấn ngày 10/10/2026. Tham khảo giao diện làm bài Đọc của [vstep.vietpq.com](https://vstep.vietpq.com): trang giới thiệu đề có nút “Bắt đầu làm bài”, ô đếm câu đã làm, đáp án A–D, lời giải tiếng Việt sau khi chấm.

## Quyết định

| Câu hỏi | Chốt |
| --- | --- |
| Chuẩn đề | HSK 2.0, phần Đọc: 20 câu, 4 phần, mỗi phần 5 câu; chỉ dùng 150 từ HSK 1 |
| Phạm vi | Chỉ kỹ năng Đọc; bản đầu có 1 đề, dữ liệu để thêm đề sau |
| Tranh | Emoji, mỗi tranh có mô tả tiếng Việt cho trình đọc màn hình |
| Pinyin | Luôn hiện trên chữ Hán như đề thật |
| Vị trí | Route `/hsk1`; thêm mục “HSK 1” vào thanh dưới của trang chủ |
| Thời gian | Không tính giờ |
| Chế độ | Chỉ luyện tập: chọn đáp án là chấm và giải thích ngay, khóa câu đã làm |
| Bố cục | Mỗi màn một câu, có Trước/Sau và nút “Câu tiếp theo” |
| Kết quả | Điểm thang 100 (5 điểm/câu), đạt từ 60, điểm từng phần, danh sách câu sai để xem lại |
| Tra từ | Sau khi trả lời, chạm từ chữ Hán trong lời giải để xem Pinyin và nghĩa |
| Lưu tiến độ | Không; tải lại bắt đầu mới |
| Duyệt nội dung | Tự rà soát rồi phát hành; người dùng góp ý trên bản production |

Mốc 60/100 chỉ để tham khảo: HSK 1 thật chấm Nghe + Đọc, đạt khi tổng từ 120/200.

## Cấu trúc đề (HSK 2.0)

| Phần | Câu | Dạng | Lựa chọn |
| --- | --- | --- | --- |
| 1 | 1–5 | Tranh + một từ: khớp hay không | ✓ / ✗ |
| 2 | 6–10 | Đọc câu, chọn tranh | 6 tranh A–F, 1 tranh dùng cho ví dụ |
| 3 | 11–15 | Đọc câu hỏi, chọn câu đáp | 6 câu A–F, 1 câu dùng cho ví dụ |
| 4 | 16–20 | Điền từ vào chỗ trống (câu đơn và hội thoại) | 6 từ A–F, 1 từ dùng cho ví dụ |

Mỗi phần có ví dụ mẫu (mở bằng “Xem ví dụ”). Lựa chọn đã dùng cho ví dụ được đánh dấu và không bấm được. Năm câu của phần 2–4 dùng năm lựa chọn còn lại, mỗi lựa chọn đúng một lần, như đề thật.

## Luồng

1. Trang chủ → mục “HSK 1” ở thanh dưới → `/hsk1`.
2. Giới thiệu đề: 20 câu · 4 phần · không tính giờ · thang 100, cấu trúc 4 phần, nút “Bắt đầu làm bài”. Nút X quay về trang học.
3. Làm bài: header có X, “Câu n/20”, Trước/Sau; thanh tiến độ theo số câu đã trả lời. Chọn đáp án → khóa, tô đúng/sai, lời giải: dịch câu, vì sao, chữ Hán chạm được để tra từ.
4. Cuối đề: còn câu chưa làm thì “Làm câu còn thiếu”; đủ 20 câu thì “Xem kết quả”.
5. Kết quả: điểm, đạt/chưa đạt, đúng từng phần, nút mở lại câu sai, “Làm lại từ đầu”.

## Triển khai

- `lib/hsk1-vocabulary.ts`: từ HSK 1 kèm Pinyin và nghĩa tiếng Việt; dùng để hiện Pinyin, tra từ và kiểm tra đề không vượt từ vựng.
- `lib/hsk1-reading.ts`: dữ liệu đề (câu tách từ bằng khoảng trắng), reducer làm bài và tính điểm.
- `app/hsk1/page.tsx` + `components/hsk1/*`: giới thiệu, câu hỏi theo 4 dạng, lời giải, kết quả.
- Unit test: mọi từ trong đề thuộc HSK 1 (trừ tên riêng), cấu trúc 4×5, đáp án phần 2–4 là song ánh với 5 lựa chọn không dùng cho ví dụ, đồng bộ với [nội dung đề](hsk1-reading-content.md), reducer và điểm.
- E2E (360/390/430): vào từ trang chủ, làm đủ 20 câu đúng/sai xen kẽ, tra từ, điểm khớp, xem lại câu sai, làm lại; axe và không cuộn ngang.

## Ngoài phạm vi

Nghe, nhiều đề, tính giờ, chế độ thi thử, lưu tiến độ, tài khoản, bình luận. Đề do AI soạn theo cấu trúc HSK 2.0, không chép đề chính thức; chưa có giáo viên tiếng Trung duyệt.
