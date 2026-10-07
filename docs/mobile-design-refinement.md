# Tinh gọn màn hình học — 07/10/2026

## Nguồn tham khảo thực tế

Khảo sát trên mobile 390 × 844: [VSTEPUP](https://vstepup.vn), [VSTEP Việt](https://vstep.vietpq.com) và [trang giới thiệu bài Reading](https://vstep.vietpq.com/doc/b1-001). Nhận xét dưới đây là quy luật suy luận từ giao diện công khai, không phải tuyên bố của tác giả.

| Thành phần | VSTEPUP | VSTEP Việt | Áp dụng cho Pinyin |
| --- | --- | --- | --- |
| Thumbnail | Đồ vật 3D thân thiện: tai nghe, sách, micro; nền kem, một chủ thể chính; ảnh kỹ năng gần 4:3 | Icon theo chủ đề, nền pastel với mảng tròn, thumbnail bài gần 16:9; nhãn nhỏ ở góc | Dùng cho danh sách chủ đề nếu bổ sung sau này. Màn hình hiện tại vào thẳng câu hỏi nên không thêm ảnh chiếm chiều cao hoặc gợi đáp án |
| Chữ | Quicksand, tiêu đề đậm, metadata nhỏ | Quicksand, phân cấp tiêu đề/nội dung phụ rõ | Giữ font; câu tiếng Việt và Pinyin là trọng tâm |
| Bố cục | Header trắng, nền chấm nhẹ, thẻ trắng bo lớn, viền mảnh | Cùng hệ thẻ; header gọn, nút xanh nổi bật | Giữ nền/thẻ; giảm phần giới thiệu và nhãn lặp |
| Màu | Xanh đậm cho hành động; pastel phụ trợ | Xanh sáng cho điều hướng; pastel phân nhóm | Giữ xanh hiện tại; xanh lá/đỏ chỉ phản hồi đáp án |

### Use case rút ra

- Chọn kỹ năng/chủ đề: thumbnail giúp nhận diện nhanh; hình đi kèm tên và metadata, không chứa cả đoạn chữ.
- Xem giới thiệu bài: thông tin bài + một hành động chính. Trang Reading tham khảo không có hero thumbnail lớn.
- Làm bài Pinyin: câu hỏi → ba lựa chọn → giải thích → câu tiếp theo. Đây là quyết định áp dụng cho sản phẩm, không suy diễn trạng thái chấm bài của website tham khảo.
- Khi có danh sách chủ đề trong tương lai: một chủ thể liên quan chủ đề, nền pastel nhẹ, bố cục nhất quán; tạo tài sản riêng, không sao chép ảnh/nhãn hiệu của hai trang.

## Áp dụng feedback trên ảnh production

- Bỏ trái tim bên phải header, chuyển `Câu n/20` vào đúng vị trí đó.
- Bỏ tiêu đề “Một câu nhỏ, thêm gần nhau”, nhãn “Hỏi em”/“Báo cho em”, footer khẩu hiệu.
- Giữ dòng “20 câu nhắn tin cùng người thương.” vì không bị gạch trong ảnh.
- Giữ progress biểu thị số câu đã trả lời trong thẻ. Số trên header biểu thị câu đang học; hai giá trị khác nhau trước khi chọn đáp án.
- Header cho phép xuống dòng khi tăng cỡ chữ 200%, tránh đẩy bộ đếm ra ngoài màn hình.
- Giữ nguyên nội dung 20 câu và hành vi học. Fixtures phát triển dùng cùng header mới.

## Kiểm chứng

Chạy lint, typecheck, unit tests và Playwright trên 360 × 800, 390 × 844, 430 × 932; bao gồm luồng 20 câu, chọn đúng/sai, hoàn thành/học lại, bàn phím, cỡ chữ 200%, kiểm tra accessibility và tràn ngang. Không kiểm thử desktop theo phạm vi đã thống nhất.

Kết quả: build Cloudflare Worker thành công; lint/typecheck đạt; 6/6 unit tests và 9/9 Playwright tests đạt. Đã xem ảnh câu hỏi và cỡ chữ lớn để kiểm tra bố cục.

- [Màn hình câu hỏi 390px](screenshots/mobile-refinement/question-390.png)
- [Giải thích câu dài 360px](screenshots/mobile-refinement/feedback-360.png)
