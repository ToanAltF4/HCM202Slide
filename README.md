# Kỷ cương & đạo đức công vụ trong tư tưởng Hồ Chí Minh

Website trình chiếu của **Nhóm 6 · HCM202 · Lớp SE1810 · GV HieuNT328**.
Công nghệ: Vite, React, Three.js (React Three Fiber) và Motion. Không cần backend.

## Chạy
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # xuất ra thư mục dist/ (deploy lên Vercel/Netlify/GitHub Pages đều được)
npm run preview    # xem bản build
```
Font được đóng gói sẵn, nên khi trình chiếu trên lớp **không cần internet**.

## Điều khiển
`→` / `Space` chuyển slide tiếp · `←` quay lại · `G` xem tổng quan · `N` mở lời thoại · `F` toàn màn hình · con lăn chuột, vuốt màn hình · rê chuột lên các vạch ở thanh dưới để xem tên slide.
Mỗi slide có URL riêng (`/#16` là slide quiz), nên có thể mở thẳng đến slide cần trình bày.

## Cấu trúc
| File | Nội dung |
|---|---|
| `src/data/slides.jsx` | Toàn bộ slide và các phần (sửa nội dung ở đây) |
| `src/data/meta.js` | Tên môn, lớp, giảng viên, khai báo AI Usage |
| `src/data/quiz.js` | 4 câu trắc nghiệm |
| `src/data/images.js` | Ảnh từ `TÀI LIỆU PHÁT TRIỂN.md` kèm nguồn |
| `src/data/webImages.json` | Ảnh tải từ báo chính thống kèm nguồn |
| `src/data/stories.json`, `stories.config.js` | Câu chuyện dẫn dắt; slide chỉ dùng 2 câu, các câu còn lại để dự phòng |
| `src/components/` | Deck (trình chiếu), Pager (phân trang), Scene3D (ngôi sao 3D), Gallery3D, Quiz |
| `docs/TOM-TAT-GIAO-TRINH.md` | Tóm tắt giáo trình tr. 80 – 90, định vị Chương IV |
| `docs/Kich-ban-thuyet-trinh-Nhom6.docx` (và `.txt`) | Script nói cho 4 bạn, ghi rõ từng slide |
| `src/data/script.json` | Nguồn của script, cũng là lời thoại hiện khi bấm phím `N` |

## Phân công
| Người nói | Phần | Slide | Thời lượng |
|---|---|---|---|
| Tiến | Mở đầu, Phần I: Nhà nước của dân & pháp quyền (GT tr. 80–86) | 1–14 | 8–9 phút |
| Hoài Anh | Phần II: Hỏi nhanh & tình huống (tương tác) | 15–17 | 6–7 phút |
| Long | Phần III: Kiểm soát quyền lực, kỷ cương, đạo đức công vụ (GT tr. 86–89) | 18–24 | 8–9 phút |
| Toàn | Phần IV: Nghiêm minh, vụ án Trần Dụ Châu, nêu gương, kết luận (GT tr. 89–90) | 25–33 | 7–8 phút |

## Nguồn & AI
- Mọi hình ảnh là **ảnh tư liệu có nguồn** (TTXVN, Nhân Dân, QĐND, Báo Chính phủ, VnExpress, VietnamPlus, Thanh Niên…). Không có ảnh do AI tạo. Danh sách đầy đủ nằm ở slide “Tài liệu tham khảo & nguồn ảnh”.
- AI Usage: nhóm **chỉ sử dụng Claude (Anthropic)**.
