# Từ điển sơ cấp

Lập ngày 10/10/2026 theo yêu cầu “màn hình từ điển tiếng Trung sơ cấp có thật nhiều từ thông dụng”; triển khai cùng ngày tại `/tu-dien`.

## Khác với kế hoạch ban đầu

- 601 từ thay vì 595: bộ dữ liệu không xếp 6 từ của đề HSK 1 trên web (饭店, 没有, 说, 哪儿, 那儿, 这儿) vào cấp 1–3 (nó dùng 饭馆, 没, 说话…), nên bổ sung chúng vào cấp 1.
- 156 từ cấp 1 dùng lại Pinyin và nghĩa của `lib/hsk1-vocabulary.ts` để thống nhất với đề HSK 1; chỉ thêm âm Hán Việt.
- Biên tập nằm trong `scripts/dictionary/curated-*.txt` (`chữ Hán | pinyin | Hán Việt | nghĩa`), `scripts/build-dictionary.ts` ghép với nguồn đã ghim commit rồi ghi `lib/dictionary.json` và [danh sách cần xem lại](dictionary-review.md). Script dừng khi thiếu từ, trùng từ, Pinyin không khớp chữ cái của bộ dữ liệu, hoặc số âm Hán Việt khác số chữ.
- Đã rà 133 âm Hán Việt lệch Unihan: gần như toàn bộ do Unihan ghi âm Nôm/âm hiếm (子 “tí”, 吃 “khật”); sửa 爬 thành “bà”. Chọn dǎsuàn cho 打算 theo sách HSK.
- Kokoro đọc sai khi đứng riêng 长 (zhǎng), 教 (jiào), 照片 (zhàopiān); generator tổng hợp ba từ này từ phiên âm lấy của 长城, 教书, 照片 để đúng cách đọc trong từ điển. Các khác biệt còn lại là biến điệu thanh 3 hoặc thanh nhẹ.
- Chip lọc hiện số từ dưới nhãn; ô tìm và header dính trên cùng, chip cuộn theo nội dung.

## Quyết định đã chốt

| Câu hỏi | Chốt |
| --- | --- |
| Bộ từ | HSK 2.0 cấp 1–3: 601 từ (156 + 147 + 298), khớp chuẩn của đề HSK 1 đang có |
| Mỗi từ | Chữ Hán, Pinyin, nghĩa tiếng Việt, cấp HSK, **âm Hán Việt**, **audio** |
| Tìm kiếm | Một ô tìm: chữ Hán, Pinyin có/không dấu, tiếng Việt có/không dấu, âm Hán Việt |
| Duyệt | Lọc theo cấp: Tất cả · HSK 1 · HSK 2 · HSK 3 |
| Vị trí | Mục thứ 5 ở thanh dưới: Học · Quiz · Luyện gõ · HSK 1 · Từ điển; route `/tu-dien` |

Không làm ở bản này: HSK 3.0, câu ví dụ, nhóm chủ đề, đánh dấu yêu thích, trang chi tiết từng từ, nhập chữ viết tay, dùng offline.

## Nguồn dữ liệu (đã kiểm tra)

| Nguồn | Dùng cho | Giấy phép | Ghi chú |
| --- | --- | --- | --- |
| [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) | Danh sách từ, cấp HSK 2.0, Pinyin, xếp hạng tần suất | MIT | `wordlists/inclusive/old/3.json`: 595 từ |
| [CVDICT](https://github.com/ph0ngp/CVDICT) | Nghĩa tiếng Việt gốc | CC BY-SA 4.0 | Dịch từ CC-CEDICT bằng AI và có sửa tay; thiếu 1/595 từ (打篮球), nghĩa thường dài |
| [Unihan](https://www.unicode.org/charts/unihan.html) `kVietnamese` | Đối chiếu âm Hán Việt | Unicode License | Thiếu 91/618 chữ; nhiều chữ không ra âm thường dùng (你 → “nể”, 吃 → “khật”), nên chỉ dùng để đối chiếu |

Nghĩa dựa trên CVDICT nên file dữ liệu từ điển phát hành theo CC BY-SA 4.0 và ghi nguồn ở cuối màn hình lẫn trong tài liệu. Mã nguồn ứng dụng không bị ảnh hưởng.

## Dữ liệu

`lib/dictionary.json`, khoảng 60–80 KB, tải cùng trang (không cần server hay database):

```ts
type DictionaryEntry = {
  hanzi: string;    // 学生
  pinyin: string;   // xuésheng — viết liền theo từ, như sách HSK
  hanViet: string;  // học sinh
  meaning: string;  // 1–3 nghĩa ngắn, cách nhau bằng “; ”
  level: 1 | 2 | 3; // cấp HSK 2.0 thấp nhất có từ này
  rank: number;     // tần suất, dùng khi xếp kết quả tìm kiếm
};
```

Quy trình tạo, có thể chạy lại:

1. `scripts/build-dictionary.py` tải hai nguồn theo commit cố định, ghép theo chữ giản thể, xuất bản nháp gồm mọi nghĩa CVDICT và mọi âm Unihan.
2. Biên tập bằng AI, theo lô:
   - rút gọn còn 1–3 nghĩa đúng với cách dùng ở HSK sơ cấp;
   - chọn âm đọc HSK cho 141 từ có nhiều cách đọc (的/得/地, 东西…);
   - viết âm Hán Việt cho cả từ.
3. Đối chiếu tự động, xuất danh sách cần xem lại vào `docs/dictionary-review.md`:
   - âm Hán Việt không nằm trong các âm Unihan của chữ đó, hoặc chữ không có trong Unihan;
   - số âm tiết Hán Việt khác số chữ;
   - Pinyin của 150 từ HSK 1 lệch với `lib/hsk1-vocabulary.ts`.
4. Rà các mục trong danh sách đó rồi mới phát hành.

## Màn hình `/tu-dien`

- Header như trang HSK 1: nút X về trang học, tiêu đề “Từ điển”.
- Thanh dính trên cùng: ô tìm (có nút xóa); chip lọc cấp kèm số từ nằm ngay dưới. Dòng đếm “601 từ” được đọc cho trình đọc màn hình (`aria-live`).
- Mỗi dòng: chữ Hán lớn, Pinyin, âm Hán Việt, nghĩa, nhãn HSK n, nút loa 44px.
- Thứ tự mặc định: theo cấp rồi Pinyin A–Z. Khi có từ khóa thì xếp theo độ khớp:
  1. đúng chữ Hán;
  2. chữ Hán bắt đầu bằng từ khóa;
  3. đúng Pinyin;
  4. Pinyin bắt đầu bằng từ khóa;
  5. khớp âm Hán Việt;
  6. khớp nghĩa.

  Các từ cùng mức xếp theo tần suất.
- Hiện 50 kết quả đầu, nút “Xem thêm 50 từ”. Không có kết quả thì gợi ý gõ không dấu hoặc gõ chữ Hán.
- Chuẩn hóa tìm kiếm:
  - Pinyin: bỏ dấu thanh và khoảng trắng, chấp nhận `v`/`u` thay `ü`. Ví dụ `xuesheng`, `xue sheng`, `xuéshēng` đều ra 学生.
  - Tiếng Việt: bỏ dấu và đổi đ → d. Ví dụ `hoc sinh` ra 学生.
- Thanh dưới 5 mục, mỗi mục khoảng 67px ở màn 360px. Sẽ kiểm tra lại ở chữ cỡ 200%.

## Audio

- Dùng chung pipeline Kokoro v1.1-zh / `zm_010`. `scripts/audio-items.ts` thêm danh sách từ của từ điển, khóa vẫn là `word:<chữ Hán>:<pinyin>`.
- 78 từ đã có recording nhưng chỉ dùng lại được khi Pinyin viết giống hệt. Thực tế tạo 522 file mới.
- Tạo trên CPU trong máy làm việc như lần làm audio HSK 1, kiểm tra G2P các từ đa âm, rồi commit. Workflow vẫn tự bù khi nội dung đổi; nâng timeout từ 20 lên 40 phút cho trường hợp phải tạo lại nhiều.
- Không tự phát, không tải trước, mỗi lúc chỉ phát một file.

## Kiểm thử

- Unit:
  - dữ liệu đủ 601 từ, không trùng, cấp 1–3 đúng số lượng;
  - Pinyin có dấu thanh; Hán Việt và nghĩa không rỗng;
  - 150 từ HSK 1 khớp Pinyin của `lib/hsk1-vocabulary.ts`;
  - chuẩn hóa và xếp hạng tìm kiếm;
  - mỗi từ đều có trong danh sách audio.
- `python scripts/generate-audio.py --check` xác nhận đủ recording.
- E2E (360/390/430):
  - vào từ thanh dưới;
  - tìm bằng chữ Hán, Pinyin không dấu, tiếng Việt không dấu, Hán Việt;
  - lọc cấp, “Xem thêm”, phát audio;
  - axe, chữ cỡ 200%, không cuộn ngang; các luồng hiện có vẫn đạt.

## Thứ tự làm

1. Script ghép nguồn → biên tập AI → đối chiếu → rà danh sách cần xem lại → `lib/dictionary.json`.
2. Thư viện tìm kiếm và unit test.
3. Màn `/tu-dien` và mục thứ 5 ở thanh dưới.
4. Tạo 522 file audio, kiểm tra G2P.
5. E2E, build Cloudflare, merge `main`, kiểm tra production.

## Rủi ro

- Nghĩa và âm Hán Việt do AI biên tập có thể sai. Cách giảm: đối chiếu Unihan, rà danh sách cần xem lại, ghi rõ trên màn hình là “bản biên soạn”, và sửa theo góp ý.
- Từ đa âm (的/得/地, 都, 还…) chỉ hiện âm thường gặp nhất ở HSK sơ cấp. Âm khác ghi trong nghĩa nếu cần.
- Thanh dưới 5 mục khá chật ở chữ cỡ lớn. Nếu E2E chữ 200% hỏng bố cục thì chuyển nhãn xuống cỡ nhỏ hơn hoặc gộp HSK 1 + Từ điển vào mục “Thêm”.
