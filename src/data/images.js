// Ảnh đính kèm trong TÀI LIỆU PHÁT TRIỂN.md (nhóm cung cấp, có link nguồn)
export const MD_IMAGES = {
  canBo: {
    file: '/images/md/image1.jpg',
    caption: 'Chủ tịch Hồ Chí Minh nói chuyện với cán bộ, công chức',
    sourceName: 'Lời Bác dạy',
    sourceTitle: 'Lời Bác dạy ngày 26 tháng 9',
    sourceUrl: 'https://loibacday.com/loi-bac-day-ngay-nay-nam-xua/loi-bac-day-ngay-26-thang-9-59.html',
  },
  ganDan: {
    file: '/images/md/image2.jpg',
    caption: 'Chủ tịch Hồ Chí Minh thăm hỏi nhân dân',
    sourceName: 'Báo Thanh tra',
    sourceTitle: 'Nhận diện và khắc phục tình trạng “đoàn kết xuôi chiều” trong nội bộ Đảng',
    sourceUrl:
      'https://thanhtra.com.vn/theo-dong-thoi-cuoc/nhan-dien-va-khac-phuc-tinh-trang-doan-ket-xuoi-chieu-trong-noi-bo-dang-198111.html',
  },
  giamSat: {
    file: '/images/md/image3.jpg',
    caption: 'Hội nghị triển khai chương trình giám sát của Quốc hội',
    sourceName: 'Tạp chí Kinh tế Tài chính',
    sourceTitle: 'Nâng cao hiệu quả giám sát của Quốc hội, bảo đảm quyền lực nhà nước thuộc về nhân dân',
    sourceUrl:
      'https://tapchikinhtetaichinh.vn/nang-cao-hieu-qua-giam-sat-cua-quoc-hoi-bao-dam-quyen-luc-nha-nuoc-thuoc-ve-nhan-dan-23073.html',
  },
  bauCu: {
    file: '/images/md/image4.jpg',
    caption: 'Cử tri bỏ phiếu bầu đại biểu Quốc hội khóa XVI và HĐND các cấp nhiệm kỳ 2026 – 2031',
    sourceName: 'TTXVN (VNA)',
    sourceTitle:
      'Thông cáo báo chí về tình hình bầu cử đại biểu Quốc hội khóa XVI và đại biểu HĐND các cấp nhiệm kỳ 2026-2031',
    sourceUrl:
      'https://vietnam.vnanet.vn/vietnamese/tin-van/%E2%80%8Bthong-cao-bao-chi-ve-tinh-hinh-bau-cu-dai-bieu-quoc-hoi-khoa-xvi-va-dai-bieu-hoi-dong-nhan-dan-cac-cap-nhiem-ky-2026-2031-434951.html',
  },
  hienPhap: {
    file: '/images/md/image5.jpg',
    caption: 'Bản Hiến pháp năm 1946 — Hiến pháp đầu tiên của nước Việt Nam Dân chủ Cộng hòa',
    sourceName: 'Báo Thái Nguyên',
    sourceTitle: 'Những nội dung cốt lõi, tiến bộ của Hiến pháp đầu tiên',
    sourceUrl: 'https://baothainguyen.vn/chinh-tri/202309/nhung-noi-dung-cot-loi-tien-bo-cua-hien-phap-dau-tien-93449ee',
  },
  phucVu: {
    file: '/images/md/image6.jpg',
    caption: 'Tổ xung kích hỗ trợ trực tiếp công dân yếu thế làm thủ tục tại nhà',
    sourceName: 'Trung tâm Phục vụ hành chính công Hà Nội',
    sourceTitle: 'Tổ xung kích Chi nhánh số 6 hỗ trợ trực tiếp công dân yếu thế tại cơ sở',
    sourceUrl:
      'https://ttpvhcc.hanoi.gov.vn/hoat-dong-cua-trung-tam/to-xung-kich-chi-nhanh-so-6-ho-tro-truc-tiep-cong-dan-yeu-the-tai-co-so-285026032714343336.htm',
  },
}

// Ảnh & câu chuyện tải từ báo chí chính thống (src/data/*.json) — nạp mềm để không lỗi khi file chưa có
const jsonFiles = import.meta.glob('./*.json', { eager: true, import: 'default' })
export const WEB_IMAGES = jsonFiles['./webImages.json'] ?? []
export const STORIES = jsonFiles['./stories.json'] ?? []

export const webImagesByTopic = (topic, n = 2) => WEB_IMAGES.filter((i) => i.topic === topic).slice(0, n)
export const storyByTheme = (...themes) => STORIES.find((s) => themes.some((t) => s.theme?.includes(t)))
export const ALL_IMAGES = [...Object.values(MD_IMAGES), ...WEB_IMAGES]
