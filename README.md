# Học Pinyin để nhắn tin

Web cá nhân dành cho người Việt bắt đầu từ số 0, học nghĩa và Pinyin của 20 câu thường nhắn cho người yêu. Người học xưng “anh”, người nhận là “em”; mục tiêu là nhớ Pinyin để gõ bằng bàn phím tiếng Trung trên điện thoại và chọn chữ Hán phù hợp.

Trạng thái: đã hoàn thành giai đoạn 1–5, nghiệm thu mobile local đạt. Route `/` chạy đầy đủ lượt học 20 câu, lời giải, hoàn thành và học lại; chưa phát hành. Tài liệu cập nhật ngày 2026-10-07. Tên dự án hiển thị tạm thời, chưa chốt thương hiệu.

## Đọc tài liệu

| Tài liệu | Nội dung |
| --- | --- |
| [Kế hoạch MVP](docs/mvp-plan.md) | Giai đoạn triển khai, đầu việc, phụ thuộc và điều kiện hoàn thành |
| [Yêu cầu sản phẩm](docs/product-requirements.md) | Người dùng, mục tiêu, phạm vi và quyết định đã chốt |
| [Luồng và use case](docs/user-flows.md) | Trạng thái câu hỏi, đúng/sai, tiếp tục và hoàn thành |
| [Thiết kế tham chiếu](docs/design-reference.md) | Quy luật VSTEPUP, theme, thành phần và mobile |
| [Nội dung 20 câu](docs/content.md) | Tiếng Việt, Pinyin, cách gõ, chữ Hán, nghĩa từ và đáp án nhiễu |
| [Định hướng kỹ thuật](docs/technical-plan.md) | Next.js, shadcn/ui, dữ liệu và quản lý trạng thái |
| [Nghiệm thu mobile](docs/acceptance.md) | Checklist chức năng, nội dung và giao diện |
| [Todo](docs/todo.md) | Trình tự triển khai và tính năng cân nhắc sau MVP |

## Các ràng buộc chính

- Mobile-first; chỉ kiểm tra mobile web ở chiều rộng 360, 390 và 430px. Không yêu cầu tối ưu hoặc kiểm thử viewport desktop.
- Next.js và shadcn/ui; VSTEPUP là chuẩn tham chiếu về style.
- Một câu tiếng Việt, ba đáp án Pinyin, chấm ngay khi chạm.
- Sau khi trả lời: Pinyin đúng, cách gõ không dấu, chữ Hán và giải nghĩa ngắn.
- Không đăng nhập, âm thanh, luyện phát âm hay bài tự gõ trong MVP.

Tài liệu yêu cầu sản phẩm là nguồn chính về phạm vi. Tài liệu thiết kế phân biệt rõ điều đã quan sát trên VSTEPUP và điều đề xuất cho MVP. Các quyết định kỹ thuật là phương án triển khai, không phải toàn bộ đều do người dùng chỉ định.

## Chạy dự án

Yêu cầu Node.js >=22.18 (đã kiểm tra với Node 24.19.0), npm; dùng `package-lock.json`.

```bash
npm ci
npm run dev
```

Mở http://localhost:3000. Để chạy bản production:

```bash
npm run build
npm run start
```

Kiểm tra mã nguồn:

```bash
npm test
npm run lint
npm run typecheck
```

Nền tảng hiện tại: Next.js 16.4.0, React 19.3.0, Tailwind CSS 4, shadcn/ui (Radix Nova). Quicksand được phục vụ local bằng next/font; CSS theme theo VSTEPUP. Chưa cần biến môi trường để chạy local.

Xem [báo cáo giai đoạn 1](docs/phase-1-report.md).

Giai đoạn 2 dùng Node test runner để kiểm tra TypeScript, không thêm thư viện test. Xem [báo cáo giai đoạn 2](docs/phase-2-report.md).

## Xem giao diện giai đoạn 3

Chạy `npm run dev`, mở http://localhost:3000/design-preview trên viewport điện thoại. Thanh công cụ cuối trang cho phép xem câu hỏi, đúng, sai, câu dài, giải thích dài và hoàn thành; chọn đáp án cũng mở lời giải mẫu. Nút tiếp trong preview đưa đến màn hoàn thành mẫu, không chạy lượt 20 câu. Đây là công cụ review component, chưa phải luồng quiz hoàn chỉnh.

Route preview trả 404 ở production. Xem [báo cáo giai đoạn 3](docs/phase-3-report.md) và ảnh mobile trong tài liệu.

## Luồng học hiện tại

Mở `/` để bắt đầu câu 1. Chạm một đáp án để xem lời giải rồi bấm “Câu tiếp theo”. Câu cuối giữ lời giải trước khi bấm “Hoàn thành”. “Học lại” tạo lượt mới; tải lại trang cũng bắt đầu từ câu đầu vì chưa lưu tiến độ.

Session ban đầu được tạo tại request trong Next.js rồi truyền cùng dữ liệu sang client; các lần trả lời và học lại xử lý tại trình duyệt, không gọi API. `/` hiện cần Next.js runtime, không dùng static export trực tiếp. Khi triển khai Cloudflare cần xác minh adapter/runtime tương thích.

Xem [báo cáo giai đoạn 4](docs/phase-4-report.md).

## Nghiệm thu mobile tự động

Bộ E2E trong `tests/e2e/quiz.spec.ts` chạy trên bản production; cấu hình chỉ có mobile 360×800, 390×844, 430×932, touch và reduced motion. Có kiểm tra axe tự động, chữ lớn 200%, bàn phím, luồng 20 câu, học lại/reload và ẩn preview.

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

Nếu máy đã có Chromium, có thể bỏ bước tải browser và dùng:

```bash
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Test tự khởi động production server ở port 3100 (port cần trống), tự tắt sau khi chạy. Report ở `playwright-report/`, ảnh/trace trong `test-results/`; cả hai được bỏ qua bởi Git và ESLint. Xem report bằng `npx playwright show-report`.

Xem [báo cáo giai đoạn 5](docs/phase-5-report.md). Browser emulation và axe không thay thế kiểm tra Safari/iPhone thật hoặc screen reader thực tế.

## Bàn giao

MVP được bàn giao trên nhánh `feat/pinyin-mvp`, chưa merge hoặc deploy. Xem [báo cáo giai đoạn 6](docs/phase-6-report.md) và [trạng thái hosting](docs/deployment.md).
