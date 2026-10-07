# Báo cáo giai đoạn 5 — Nghiệm thu mobile

Ngày: 2026-10-07. Nhánh: `feat/pinyin-mvp`. Trạng thái: T25–T31 hoàn thành local; sẵn sàng bước bàn giao, chưa phát hành.

## Kết quả

| Kiểm tra | Kết quả |
| --- | --- |
| npm run lint | Đạt, không warning mã nguồn |
| npm run typecheck | Đạt |
| npm test | 6 test dữ liệu/logic đạt |
| npm run build | Đạt |
| npm run test:e2e | 9/9 bài đạt, lần cuối 36.4 giây |
| Viewport | 360×800, 390×844, 430×932; chỉ mobile, có touch |
| Axe | Không có violations trong các lần quét đã chạy với tag WCAG 2 A/AA và 2.1 AA |

E2E chạy bản production trên Chromium trong môi trường Linux. Lệnh thực tế dùng `CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. Môi trường có cảnh báo FORCE_COLOR/NO_COLOR từ công cụ; không có lỗi console/hydration của ứng dụng trong ba lượt học.

## Phạm vi nghiệm thu

- Ba lượt học đầy đủ, mỗi lượt 20 câu; đúng/sai xen kẽ, lời giải khớp dữ liệu, lựa chọn giữ nguyên thứ tự và khóa sau chấm.
- Chưa trả lời không có nút tiếp; thử click lặp lên đáp án đã khóa và Next ở câu dài.
- Tiến độ đúng từng mốc 5%; lời giải câu 20 được giữ trước hoàn thành.
- Học lại, reload, focus tiêu đề, cuộn về đầu; không lưu localStorage/sessionStorage hoặc gọi API khi học.
- Axe quét câu đầu, phản hồi đúng/sai, lời giải câu 11/13, màn hoàn thành và lời giải phóng to 200% ở mỗi viewport.
- Kiểm tra Tab/Enter với viewport mobile, viền focus, chữ gốc 200%, reduced motion và tiếp tục từ lời giải dài.
- Kiểm tra không tràn ngang, ba lựa chọn đầu nằm trong viewport, đáp án tối thiểu 56px, CTA tối thiểu 48px, nhãn CTA không vượt chiều rộng nút khi chữ lớn.
- Preview trả 404 ở production.
- Đã xem ảnh câu ngắn, lời giải dài và chữ lớn; đối chiếu ảnh mobile VSTEPUP đã khảo sát. Giữ Quicksand, màu xanh, card trắng/viền nhạt, bo góc và nhịp nội dung. Không tuyên bố giống pixel-perfect.
- Nội dung và dấu Pinyin được đối chiếu với tài liệu/test giai đoạn 2; chưa có kiểm duyệt ngôn ngữ độc lập.

## Lỗi đã sửa

1. Icon trái tim trang trí có aria-label trên span không có role hợp lệ: chuyển thành aria-hidden, tránh nhãn trợ năng không đúng.
2. CSS utility ghi đè outline focus: đặt quy tắc focus-visible rõ ràng bên ngoài layer nền để viền luôn hiện khi dùng bàn phím.
3. Ảnh kiểm tra chữ 200% phát hiện nút tiếp bị cắt nhãn dù trang không tràn ngang: cho CTA tự tăng chiều cao/xuống dòng, dùng khoảng đệm mobile cố định cho khung và lựa chọn. Bổ sung kiểm tra chiều rộng nội dung nút.
4. ESLint quét nhầm JavaScript sinh ra trong report Playwright: thêm ignore cho playwright-report và test-results, cùng Git ignore.

Đã build lại và chạy lại cả bộ E2E sau sửa UI. Không còn lỗi chặn sử dụng trong phạm vi đã kiểm tra.

## Cách chạy lại

```bash
npm ci
npx playwright install chromium
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Máy có Chromium sẵn có thể dùng biến `CHROMIUM_EXECUTABLE_PATH`. Cấu hình test ở playwright.config.ts; test ở tests/e2e/quiz.spec.ts. Port 3100 cần trống; runner tự bật/tắt production server. HTML report và trace được sinh local, không commit.

## Ảnh nghiệm thu

- [Câu hỏi 390px](screenshots/phase-5/question-390.png)
- [Câu 13 và lời giải 360px](screenshots/phase-5/long-feedback-360.png)
- [Chữ lớn 200% ở 360px](screenshots/phase-5/large-text-360.png)

## Giới hạn còn lại

Chưa kiểm tra Safari/iPhone thật, bàn phím/trình đọc màn hình thật, pinch zoom thiết bị thật hoặc notch iPhone thật. Test 200% thay đổi cỡ chữ gốc; không đồng nghĩa thử mọi cơ chế zoom. Axe không chứng nhận tuân thủ WCAG toàn diện. Chưa có URL hosting để nghiệm thu môi trường triển khai; route `/` cần Next.js runtime.

Giai đoạn 6 còn lại: rà soát diff, chuẩn bị commit/PR và xác minh hosting khi triển khai. Mục ghi kết quả trong PR ở acceptance.md vẫn để mở vì chưa tạo PR.
