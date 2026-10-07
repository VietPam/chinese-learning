# Trạng thái triển khai

Kiểm tra ngày 2026-10-07.

## Bằng chứng hiện có

- GitHub check của main là `Workers Builds: chinese-learning`, kết quả failure sau commit reset.
- Check trỏ tới Cloudflare Workers, service `chinese-learning`; không có deployment được GitHub API trả về trong lần kiểm tra.
- Repo không có wrangler.json/jsonc/toml hoặc cấu hình OpenNext. Môi trường tác vụ không có credential/identity Cloudflare được cấu hình.
- Chưa đọc được build command, deploy command, runtime flags hoặc branch deployment settings từ Cloudflare dashboard. Không suy ra các giá trị này từ tên check.

## Yêu cầu ứng dụng hiện tại

`/` dùng Next.js connection() để tạo lượt học theo request. Cần Next.js runtime; `next build` thành công không có nghĩa đã tạo bundle Cloudflare Worker.

Chạy bằng Node:

```bash
npm ci
npm run build
npm run start
```

Node >=22.18.0 theo package.json. Port mặc định 3000. Ứng dụng chưa cần database hoặc biến môi trường nghiệp vụ.

## Khi triển khai lên Cloudflare

1. Đọc cấu hình Workers Builds của service hiện tại: nhánh, root directory, build/deploy commands, Node version, compatibility flags.
2. Xác minh adapter Cloudflare/OpenNext hỗ trợ đúng Next.js 16.4.0, React 19.3.0 và cơ chế CSS hiện tại trước khi cài.
3. Thêm adapter và cấu hình Wrangler đúng service; chạy build adapter và preview runtime. Không dùng `next start` như lệnh deploy Worker.
4. Thử `/`, font local, tải lại và hết lượt trên runtime preview.
5. Sau khi phát hành, kiểm tra lại URL thật và ghi URL/check deploy vào báo cáo.

Chưa thực hiện các bước này, chưa có URL MVP đã deploy. Không tự thay đổi hosting hoặc branch production trong lượt bàn giao PR.

## Cập nhật khi được yêu cầu merge và deploy

Người dùng đã yêu cầu merge PR #2 và triển khai https://china.vietpq.com. Đã bổ sung:

- OpenNext 1.20.9, Wrangler 4.148.0, open-next.config.ts và wrangler.jsonc.
- Worker `chinese-learning`, ASSETS, WORKER_SELF_REFERENCE, nodejs_compat và route custom domain `china.vietpq.com`.
- Custom build gọi `npm run build:worker` để cả lệnh Wrangler deploy của Workers Builds tạo được bundle đúng.
- Next.js/eslint-config-next pin 16.3.8: 16.4.0 build thành công nhưng runtime gặp lỗi preview-props manifest; 16.3.8 đã trả HTTP 200 trong workerd local.
- Không cần R2 cho các trang hiện tại không dùng ISR/cache nghiệp vụ.

Wrangler whoami xác nhận môi trường local chưa đăng nhập Cloudflare. Triển khai dự kiến qua kết nối GitHub Workers Builds đang có; kết quả deploy và kiểm tra domain sẽ được xác nhận sau merge, không suy ra từ local build.

## Sửa lỗi build command từ log production

Log người dùng cung cấp cho thấy `npm run build` chỉ tạo `.next`; Wrangler 4.148.0 tự chuyển sang `opennextjs-cloudflare deploy`, bỏ qua custom build và báo thiếu compiled OpenNext config.

Đã sửa: `build` = `opennextjs-cloudflare build`; `build:next` = `next build`; `open-next.config.ts` đặt `buildCommand` = `npm run build:next`. Bỏ custom build trong Wrangler. Cấu hình dashboard giữ nguyên `npm run build` / `npx wrangler deploy`.

Lệnh build phải tạo `.open-next/worker.js`, assets và compiled OpenNext config trước bước deploy. Đây là sửa cấu hình đóng gói, không thay đổi dữ liệu hoặc hành vi học.
