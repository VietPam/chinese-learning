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
