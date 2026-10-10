# Audio miễn phí ở màn hình Học

## Lựa chọn

Người dùng chọn Kokoro-82M, giọng nam, chỉ phát ở Học. Dùng [bản chính thức v1.1-zh](https://huggingface.co/hexgrad/Kokoro-82M-v1.1-zh), giọng `zm_010`, tốc độ tổng hợp 0.9, 24 kHz mono, MP3 64 kbps. Model Apache-2.0; bản chuyên Trung được tác giả bổ sung dữ liệu 100 người nói từ LongMaoData. Đây không phải giọng `zm_yunxi` của v1.0; bảng đánh giá mức D ở v1.0 không áp dụng trực tiếp cho bản này.

Không dùng API trả phí, không có khóa TTS. Chạy model bằng CPU khi tạo file; trình duyệt chỉ tải MP3 tĩnh. Repo hiện public, workflow dùng runner Ubuntu tiêu chuẩn của GitHub Actions; không đăng ký runner trả phí.

## Trải nghiệm

- Một nút loa 44px cạnh câu tiếng Việt; không tự phát, không tải audio trước khi bấm.
- Bấm lần nữa để dừng; nghe lại phát từ đầu. Đổi câu hoặc mục dừng audio cũ.
- Lỗi mạng có phản hồi ngắn và cho thử lại. Chỉ Học có audio, không thêm vào Quiz/Luyện gõ.
- Nếu câu chưa được tạo audio hoặc chữ Hán đã sửa, nút bị vô hiệu hóa thay vì phát bản cũ.

## Tạo và cập nhật

`python scripts/generate-audio.py --check` kiểm tra đủ file, nội dung và SHA256, không cần cài model.

Để tạo trên CPU: cài Python 3.12, ffmpeg; cài torch 2.6.0 từ index CPU, sau đó `pip install -r scripts/audio-requirements.txt` và chạy `python scripts/generate-audio.py`.

Model/config/voice tải từ revision cố định `01e7505bd6a7a2ac4975463114c3a7650a9f7218`. Tên file có hash theo chữ Hán, voice, model, tốc độ và phiên bản công cụ. Chỉ tạo câu thiếu/thay đổi; `--force` để tạo lại tất cả. Manifest lưu trong `lib/audio-manifest.json`, MP3 trong `public/audio`.

Workflow `.github/workflows/audio.yml` chạy khi main đổi nội dung/công cụ hoặc chạy tay. Nó kiểm tra trước, chỉ cài model khi cần; cache tải model, tổng hợp CPU, kiểm tra rồi commit file vào main để hệ thống Cloudflare hiện có triển khai. Commit chỉ audio/manifest không trùng bộ lọc kích hoạt. Không force-push; nếu main đổi gây xung đột thì workflow thất bại an toàn, có thể chạy lại. `workflow_dispatch` có tùy chọn `rebuild` để kiểm chứng tổng hợp trên runner.

Bản nội dung mới có thể deploy trước commit audio; lúc đó câu chưa có recording sẽ tạm không nghe được, không phát sai câu. Nếu workflow thất bại, audio cũ của những câu không đổi vẫn dùng được.

## Kiểm chứng và giới hạn

Kiểm tra file không rỗng, có tín hiệu, thời lượng hợp lý; manifest đúng toàn bộ câu. E2E kiểm tra không autoplay, phát file thật, dừng khi đổi câu/mục, lỗi tải và thử lại, cùng luồng mobile/chữ lớn hiện có. Chưa coi đây là kiểm duyệt phát âm của giáo viên hoặc kiểm thử âm thanh trên iPhone thật. Người học có thể nghe thử câu 1, 21, 22 ngay trên web để đánh giá giọng.

## Nghe từ trong bảng (09/10/2026)

Theo ảnh feedback, thêm nút loa 44px ở cuối mỗi hàng từ vựng, chỉ trong Học. Bảng Quiz giữ ba cột. Dùng cùng Kokoro v1.1-zh / zm_010; hiện có 27 từ/cụm riêng và 22 câu (49 recordings). Khóa từ gồm chữ Hán và Pinyin để phân biệt cách đọc, tái sử dụng từ lặp giữa các câu. Generator/workflow hiện có tự phát hiện và tạo thêm recording từ.

Nút từ có tên truy cập `Nghe từ …`; chỉ một recording được phát tại một thời điểm, bao gồm cả câu và từ. Đổi câu/mục dừng toàn bộ audio đang phát. Không preload hàng loạt file. Khi tải lỗi, từng nút có trạng thái thử lại riêng.

Đã kiểm tra đầu ra frontend của các trợ từ 了/的/吗/啊 dùng thanh nhẹ và 路上 dùng shang thanh nhẹ theo nội dung; việc kiểm tra này không thay thế thẩm định âm thanh của người nói tiếng Trung.

## Audio trang Đọc HSK 1 (10/10/2026)

Người dùng yêu cầu thêm audio cho `/hsk1`. Dùng cùng Kokoro v1.1-zh / `zm_010`, tốc độ 0.9; cả hai vai trong hội thoại phần 4 dùng chung giọng nam.

- Audio chỉ có trong lời giải, sau khi trả lời, để phần làm bài vẫn là đọc. Mỗi dòng chữ Hán trong lời giải có nút loa 44px: câu đề, từ của tranh ở phần 1, câu đáp đúng ở phần 3, câu phần 4 đã điền đáp án. Nút có tên truy cập `Nghe <câu chữ Hán>`.
- Bảng tra từ có nút `Nghe từ <pinyin>`, dùng chung recording từ với màn Học khi trùng chữ Hán và Pinyin.
- Danh sách câu/từ cần thu lấy từ `explanationRows()` trong `lib/hsk1-reading.ts` qua `scripts/audio-items.ts`; khóa manifest là `hsk1:<câu>` và `word:<chữ Hán>:<pinyin>`, file `hsk1-<hash>.mp3`. Generator gọi Node để đọc nội dung TypeScript, nên workflow cài Node 22 và theo dõi thêm `lib/hsk1-reading.ts`, `lib/hsk1-vocabulary.ts`, `scripts/audio-items.ts`.
- Vẫn không tự phát, không preload, một recording tại một thời điểm; chuyển câu dừng audio.

Lần đầu: 29 câu và 57 từ mới được tạo bằng CPU với cùng model/revision/giọng, phần còn lại tái sử dụng recording đã có.
