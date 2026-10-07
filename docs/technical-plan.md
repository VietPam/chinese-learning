# Định hướng kỹ thuật

> Cập nhật 07/10/2026: [Học · Quiz · Luyện gõ](learning-expansion.md) thay thế các mô tả cũ về quiz theo thứ tự, không bỏ qua/quay lại và chưa có luyện gõ.
## Công nghệ

Người dùng yêu cầu Next.js và shadcn/ui. Phương án triển khai: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui và dữ liệu tĩnh trong repo. Chọn phiên bản ổn định tương thích tại thời điểm khởi tạo, ghi lockfile và lệnh build thực tế khi đã có code.

Một route `/`; page bao ngoài có thể là Server Component, phần quiz là Client Component. Không cần backend, database, tài khoản, API chấm bài hoặc lưu localStorage cho MVP.

## Cấu trúc đề xuất

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  learning-header.tsx
  pinyin-quiz.tsx
  question-card.tsx
  answer-option.tsx
  answer-feedback.tsx
  word-meaning-list.tsx
  session-complete.tsx
  ui/                     # Thành phần shadcn/ui
lib/
  content.ts              # 20 câu và ID đáp án nhiễu
  quiz.ts                 # Tạo lựa chọn, chuyển trạng thái
  types.ts
```

shadcn/ui tối thiểu: Button, Card, Badge, Progress, Separator. AnswerOption dùng button vì bấm là chấm ngay. Theme override theo [thiết kế](design-reference.md).

## Mô hình nội dung

```ts
type Phrase = {
  id: string;
  category: 'ask' | 'update';
  vietnamese: string;
  pinyin: string;
  keyboardInput: string;
  hanzi: string;
  words: { pinyin: string; hanzi: string; meaning: string }[];
  distractorIds: [string, string];
  note?: string;
};
```

Đáp án dùng ID câu, không dùng index hoặc so sánh chuỗi đã bỏ dấu. Mỗi câu có hai distractor ID hợp lệ, khác nhau và khác ID chính. Không lấy hai cách nói đồng nghĩa làm đáp án nhiễu.

`keyboardInput` lưu riêng để biên tập chính xác. Khoảng trắng chỉ hỗ trợ đọc các cụm gõ; không phải hướng dẫn rằng mọi IME đều xử lý khoảng trắng giống nhau. Nếu thêm âm ü sau này, cần giải thích cách nhập v/ü theo bàn phím thay vì bỏ dấu thành u.

## Trạng thái lượt học

- `sessionId`: ID duy nhất cho mỗi lượt, tạo tại ranh giới bắt đầu/học lại.
- `questionIndex`: vị trí hiện tại.
- `selectedAnswerId`: null khi chưa chọn.
- `optionIdsByQuestion`: thứ tự đáp án ổn định trong lượt.
- `isComplete`: chỉ true sau khi bấm hoàn thành tại câu cuối đã trả lời.

Suy ra đúng/sai từ selectedAnswerId và ID câu. Không cần lưu score hoặc danh sách câu sai. Chỉ cho phép NEXT khi câu hiện tại đã trả lời. RESET đặt lại toàn bộ state.

Khởi tạo thứ tự ngẫu nhiên an toàn phía client; không dùng random khác nhau ở server/client gây hydration mismatch. Khi chưa sẵn sàng, giữ khung gọn và tránh cho bấm lựa chọn đang đổi vị trí.

## Giao diện và truy cập

Quicksand cho tiếng Việt/Pinyin, font hỗ trợ CJK cho chữ Hán. Kiểm tra glyph có dấu. Nút đủ vùng chạm, focus ring, phản hồi aria-live, nhãn tiến độ có ý nghĩa. Các đáp án đã khóa vẫn giữ độ tương phản để đọc lại.

## Kiểm tra và triển khai

Kiểm tra build/typecheck, dữ liệu câu và logic chuyển trạng thái; browser test ở viewport điện thoại. Chi tiết ở [nghiệm thu](acceptance.md). Không cần test desktop.

Hosting chưa chốt. Kiểm tra Cloudflare đang cấu hình Workers, Pages hay cách build nào trước khi chọn adapter hoặc static export. Không thêm cấu hình triển khai dựa trên phỏng đoán; không cần hosting để hoàn tất tài liệu này.

## API logic đã triển khai ở giai đoạn 2

- `createQuizSession(sessionId, random?)`: tạo lượt mới, đảo lựa chọn một lần; random có thể truyền vào để kiểm thử xác định.
- `quizReducer(state, action)`: reducer thuần, không gọi random hoặc thay đổi state cũ.
- `ANSWER`, `NEXT`, `COMPLETE` mang `sessionId` và `questionId` của màn hình phát sinh thao tác để loại bỏ sự kiện cũ.
- `RESET` nhận session mới từ `createQuizSession` với ID khác; tạo ID/state ngoài reducer, tại event handler hoặc ranh giới khởi tạo.
- `getQuizProgress`: số đã trả lời, tổng câu và phần trăm.
- `isAnswerCorrect`: null nếu chưa trả lời, boolean nếu đã chọn; chấm theo ID, độc lập vị trí.

Khi ghép UI ở giai đoạn 4, dùng cùng state đã serialize từ server cho hydration, hoặc tạo session sau mount với trạng thái chờ giống nhau ở server/client. Không gọi hàm tạo lượt ngẫu nhiên trong render/useReducer initializer được chạy độc lập cả hai phía. Chưa ghép UI nên chưa xác minh hydration của quiz trong trình duyệt.

`npm test` chạy Node test runner với TypeScript stripping; Node tối thiểu 22.18.0. Các import `.ts` được hỗ trợ qua `allowImportingTsExtensions` và `noEmit`. Typecheck vẫn chạy riêng vì stripping không kiểm tra kiểu.

## Tích hợp giai đoạn 4

`app/page.tsx` gọi `connection()` để tạo `initialSession` theo request; `PinyinQuiz` dùng session này trực tiếp trong useReducer. Server và lần render client đầu tiên có cùng thứ tự đáp án. Không dùng effect để đảo đáp án sau khi người học đã nhìn thấy câu.

Học lại tạo session bằng crypto.randomUUID và createQuizSession trong event handler. Trả lời/chuyển câu giữ context ID lượt/câu. Khi đổi câu hoặc màn hình, effect focus tiêu đề và cuộn tức thì lên đầu; không cuộn khi chỉ chấm đáp án. Vùng aria-live tồn tại trước khi trả lời, chỉ cập nhật thông báo ngắn.

Hệ quả hosting: `/` chuyển từ prerender tĩnh sang render theo request; cần Next.js runtime (Node hoặc adapter Cloudflare tương thích). Không có database/API chấm bài, không đọc/ghi localStorage. Nếu sau này chọn hosting chỉ phục vụ file tĩnh, phải đổi cách khởi tạo session phía client và kiểm tra hydration lại.
