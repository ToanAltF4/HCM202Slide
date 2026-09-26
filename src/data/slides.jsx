import { useEffect, useRef, useState } from 'react'
import { animate, motion } from 'motion/react'
import { Bullets, Cards, Figure, FlipCard, Item, Quote, Shell, SourceLink, stagger } from '../components/ui'
import Quiz from '../components/Quiz'
import Gallery3D from '../components/Gallery3D'
import { AI_USAGE, COURSE, TEXTBOOK_REF } from './meta'
import { ALL_IMAGES, MD_IMAGES as M, STORIES, WEB_IMAGES } from './images'

export const SECTIONS = [
  { id: 'open', roman: '✦', name: 'Mở đầu', presenter: 'Tiến' },
  { id: 'p1', roman: 'I', name: 'Nhà nước của dân & Nhà nước pháp quyền', presenter: 'Tiến', time: '8 – 9 phút', pages: 'GT tr. 80 – 86' },
  { id: 'tt', roman: 'II', name: 'Hỏi nhanh & tình huống', presenter: 'Hoài Anh', time: '6 – 7 phút', pages: 'Tương tác' },
  { id: 'p3', roman: 'III', name: 'Kiểm soát quyền lực & kỷ cương', presenter: 'Long', time: '8 – 9 phút', pages: 'GT tr. 86 – 89' },
  { id: 'p4', roman: 'IV', name: 'Nghiêm minh & nêu gương', presenter: 'Toàn', time: '7 – 8 phút', pages: 'GT tr. 89 – 90' },
  { id: 'end', roman: '★', name: 'Kết', presenter: 'Toàn' },
]

const TT = (vol, page) => `Hồ Chí Minh, Toàn tập, Nxb CTQG, 2011, t.${vol}, tr.${page}`
const webImg = (file) => WEB_IMAGES.find((i) => i.file.endsWith(file))

/* ---------- Khối dựng dùng lại ---------- */

function Divider({ roman, title, sub, pages, by, time }) {
  return (
    <motion.div className="divider" variants={stagger} initial="hidden" animate="show">
      <Item className="divider__roman">{roman}</Item>
      <Item as="h2" className="divider__title">
        {title}
      </Item>
      {sub && (
        <Item as="p" className="divider__sub">
          {sub}
        </Item>
      )}
      {(pages || by) && (
        <Item className="divider__pages">
          {by && <span className="divider__by">Trình bày: {by}</span>}
          {time && <span className="divider__by">{time}</span>}
          {pages}
        </Item>
      )}
    </motion.div>
  )
}

function Split({ kicker, title, img, reverse, children }) {
  return (
    <Shell kicker={kicker} title={title} className={`split ${reverse ? 'split--rev' : ''}`}>
      <div className="split__grid">
        <div className="split__text">{children}</div>
        <Figure img={img} />
      </div>
    </Shell>
  )
}

function Count({ to, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = animate(0, to, {
      duration: 1.6,
      delay: 0.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => ref.current && (ref.current.textContent = Math.round(v)),
    })
    return () => c.stop()
  }, [to])
  return (
    <Item className="stat">
      <span className="stat__n" ref={ref}>
        0
      </span>
      <span className="stat__l">{label}</span>
    </Item>
  )
}

function Story({ story, img, hook }) {
  const [full, setFull] = useState(false)
  if (!story) return null
  return (
    <Shell kicker="Câu chuyện dẫn dắt" title={story.title} className="story">
      <div className={`story__grid ${img ? '' : 'story__grid--solo'}`}>
        <Item className="story__body">
          <p className={`story__text ${full ? 'story__text--full scrollable' : ''}`}>{full ? story.narration : hook}</p>
          <button type="button" className="story__more" onClick={() => setFull((f) => !f)}>
            {full ? 'Thu gọn' : 'Đọc toàn bộ câu chuyện'}
          </button>
          <div className="story__src">
            {story.sources.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                {s.name} — {s.title}
              </a>
            ))}
          </div>
        </Item>
        {img && <Figure img={img} tall />}
      </div>
    </Shell>
  )
}

/* ---------- Danh sách slide ---------- */

const base = [
  {
    id: 'cover',
    section: 'open',
    label: 'Trang bìa',
    pose: 'hero',
    render: () => (
      <motion.div className="cover" variants={stagger} initial="hidden" animate="show">
        <Item className="cover__badge">
          {COURSE.code} · {COURSE.name}
        </Item>
        <Item as="h1" className="cover__title">
          Kỷ cương <em>&amp;</em>
          <br />
          đạo đức công vụ
        </Item>
        <Item as="p" className="cover__sub">
          trong tư tưởng Hồ Chí Minh
        </Item>
        <Item className="cover__meta">
          <span>
            <small>Lớp</small>
            {COURSE.className}
          </span>
          <span>
            <small>Giảng viên</small>
            {COURSE.lecturer}
          </span>
          <span>
            <small>Thực hiện</small>
            {COURSE.group}
          </span>
        </Item>
        <Item className="cover__hint">
          <kbd>←</kbd> <kbd>→</kbd> chuyển slide · <kbd>G</kbd> tổng quan · <kbd>F</kbd> toàn màn hình
        </Item>
      </motion.div>
    ),
  },
  {
    id: 'agenda',
    section: 'open',
    label: 'Nội dung trình bày',
    render: () => (
      <Shell kicker="Lộ trình" title="Nội dung trình bày">
        <motion.ol className="agenda" variants={stagger}>
          {SECTIONS.filter((s) => s.time).map((s) => (
            <Item as="li" key={s.id} className="agenda__item">
              <span className="agenda__roman">{s.roman}</span>
              <span className="agenda__name">
                {s.name}
                <small>
                  {s.presenter}
                  {s.time && ` · ${s.time}`}
                  {s.pages && ` · ${s.pages}`}
                </small>
              </span>
            </Item>
          ))}
        </motion.ol>
      </Shell>
    ),
  },
  {
    id: 'where',
    section: 'open',
    label: 'Chúng ta đang ở đâu?',
    render: () => (
      <Shell kicker={`Định vị trong giáo trình · ${COURSE.pages}`} title="Chúng ta đang ở đâu?">
        <motion.div className="tree" variants={stagger}>
          <Item className="tree__node tree__node--l0">
            <b>{COURSE.chapter}</b> {COURSE.chapterTitle}
          </Item>
          <Item className="tree__node tree__node--l1">
            <b>II.</b> Tư tưởng Hồ Chí Minh về Nhà nước của nhân dân, do nhân dân, vì nhân dân
          </Item>
          <div className="tree__row">
            <Item className="tree__node tree__node--l2">
              <b>1.</b> Nhà nước dân chủ
              <span>b. của nhân dân · c. do nhân dân · d. vì nhân dân</span>
              <i>tr. 80 – 83</i>
            </Item>
            <Item className="tree__node tree__node--l2">
              <b>2.</b> Nhà nước pháp quyền
              <span>a. hợp hiến, hợp pháp · b. thượng tôn pháp luật · c. pháp quyền nhân nghĩa</span>
              <i>tr. 83 – 86</i>
            </Item>
            <Item className="tree__node tree__node--l2 is-focus">
              <b>3.</b> Nhà nước trong sạch, vững mạnh
              <span>a. kiểm soát quyền lực · b. phòng, chống tiêu cực</span>
              <i>tr. 86 – 90</i>
            </Item>
          </div>
          <Item as="p" className="tree__note">
            Trọng tâm của nhóm: <b>kỷ cương</b> (kiểm soát quyền lực, phòng chống tiêu cực) và <b>đạo đức công vụ</b>{' '}
            (giáo dục, nêu gương) — nền móng là Nhà nước của dân và Nhà nước pháp quyền.
          </Item>
        </motion.div>
      </Shell>
    ),
  },
  {
    id: 'question',
    section: 'open',
    label: 'Câu hỏi trung tâm',
    pose: 'section',
    render: () => (
      <motion.div className="bigq" variants={stagger} initial="hidden" animate="show">
        <Item className="kicker">Câu hỏi trung tâm</Item>
        <Item as="h2" className="bigq__text">
          Làm thế nào để quyền lực nhà nước <em>thật sự</em> phục vụ nhân dân?
        </Item>
        <Item className="bigq__chips">
          <span>Pháp luật</span>
          <span>Kỷ cương</span>
          <span>Đạo đức</span>
        </Item>
      </motion.div>
    ),
  },
  /* ===== PHẦN I · TIẾN ===== */
  {
    id: 'p1',
    section: 'p1',
    label: 'Phần I',
    pose: 'section',
    render: () => <Divider roman="I" title="Nhà nước của dân, do dân, vì dân & Nhà nước pháp quyền" sub="Giáo trình Chương IV · mục II.1 – II.2" pages="GT tr. 80 – 86" by="Tiến" time="8 – 9 phút" />,
  },
  {
    id: 'cua-dan',
    section: 'p1',
    label: '1. Nhà nước của nhân dân',
    render: () => (
      <Split kicker="1.b · Của nhân dân · GT tr. 80 – 81" title="1. Nhà nước của nhân dân là gì?" img={M.ganDan}>
        <Quote cite={TT(8, 262)}>
          Trong Nhà nước Việt Nam Dân chủ Cộng hoà của chúng ta, tất cả mọi quyền lực đều là của nhân dân.
        </Quote>
        <Item className="equation">
          <span>Của nhân dân</span>
          <b>=</b>
          <span>
            Nhân dân là <strong>chủ thể</strong> của quyền lực
          </span>
        </Item>
        <Bullets
          items={['Nguyên lý “dân là chủ”', 'Dân chủ trực tiếp — hình thức hoàn bị nhất', 'Dân chủ gián tiếp — qua đại diện do dân bầu ra']}
        />
      </Split>
    ),
  },
  {
    id: 'uy-quyen',
    section: 'p1',
    label: 'Quyền lực là “thừa ủy quyền”',
    render: () => (
      <Split kicker="1.b · Dân chủ gián tiếp · GT tr. 81 – 82" title="Quyền lực là “thừa ủy quyền” của nhân dân" img={M.canBo} reverse>
        <Quote cite={TT(7, 434)}>
          Nước ta là nước dân chủ, địa vị cao nhất là dân, vì dân là chủ… từ người quét nhà, nấu ăn cho đến Chủ tịch
          một nước đều là phân công làm đầy tớ cho dân.
        </Quote>
        <Cards
          cols={2}
          items={[
            { t: 'Cán bộ là “công bộc”', d: 'gánh vác việc chung cho dân, không phải để đè đầu dân' },
            { t: 'Dân có quyền bãi miễn', d: '“nếu Chính phủ làm hại dân thì dân có quyền đuổi Chính phủ”' },
          ]}
        />
      </Split>
    ),
  },
  {
    id: 'do-dan',
    section: 'p1',
    label: '2. Nhà nước do nhân dân',
    render: () => (
      <Split kicker="1.c · Do nhân dân · GT tr. 82" title="2. Nhà nước do nhân dân là gì?" img={M.bauCu}>
        <Item className="equation">
          <span>Do nhân dân</span>
          <b>=</b>
          <span>
            Dân <strong>lập nên</strong> &amp; <strong>tham gia</strong> vận hành
          </span>
        </Item>
        <Bullets
          items={[
            'Nhân dân “cử ra”, “tổ chức nên” Nhà nước qua bầu cử, phúc quyết',
            'Quyền làm chủ đi cùng nghĩa vụ công dân',
            'Nhân dân giám sát hoạt động của Nhà nước',
          ]}
        />
        <Quote cite={TT(12, 527)}>Muốn làm chủ được tốt, phải có năng lực làm chủ.</Quote>
      </Split>
    ),
  },
  {
    id: 'vi-dan',
    section: 'p1',
    label: '3. Nhà nước vì nhân dân',
    render: () => (
      <Split kicker="1.d · Vì nhân dân · GT tr. 83" title="3. Nhà nước vì nhân dân là gì?" img={M.phucVu} reverse>
        <Quote big cite={TT(4, 21)}>
          Việc gì có lợi cho dân thì làm. Việc gì có hại cho dân thì phải tránh.
        </Quote>
        <Cards
          cols={2}
          items={[
            { t: 'Là “đầy tớ”', d: 'trung thành, tận tụy, cần kiệm liêm chính, chí công vô tư' },
            { t: 'Là người lãnh đạo', d: 'trí tuệ, sáng suốt, nhìn xa trông rộng, gần gũi nhân dân' },
          ]}
        />
      </Split>
    ),
  },
  {
    id: 'hop-hien',
    section: 'p1',
    label: '4. Hợp hiến, hợp pháp',
    render: () => (
      <Split kicker="2.a · Nhà nước pháp quyền · GT tr. 83 – 84" title="4. Nhà nước hợp hiến, hợp pháp là gì?" img={M.hienPhap}>
        <motion.ol className="timeline" variants={stagger}>
          {[
            ['1919', 'Yêu sách của nhân dân An Nam: “Thay thế chế độ ra các sắc lệnh bằng chế độ ra các đạo luật”'],
            ['3/9/1945', 'Đề nghị sớm tổ chức TỔNG TUYỂN CỬ, xây dựng Hiến pháp dân chủ'],
            ['6/1/1946', 'Tổng tuyển cử — phổ thông đầu phiếu, trực tiếp, bỏ phiếu kín'],
            ['2/3/1946', 'Quốc hội khóa I họp phiên đầu tiên, lập Chính phủ hợp hiến'],
          ].map(([y, t]) => (
            <Item as="li" key={y}>
              <b>{y}</b>
              <span>{t}</span>
            </Item>
          ))}
        </motion.ol>
        <Item className="equation equation--sm">
          <span>Hợp hiến = đúng Hiến pháp</span>
          <b>·</b>
          <span>Hợp pháp = đúng pháp luật</span>
        </Item>
      </Split>
    ),
  },
  {
    id: 'thuong-ton',
    section: 'p1',
    label: '5. Thượng tôn pháp luật',
    render: () => (
      <Shell kicker="2.b · GT tr. 84 – 85" title="5. Thượng tôn pháp luật là gì?">
        <motion.div className="stats" variants={stagger}>
          <Count to={2} label="bản Hiến pháp Bác trực tiếp lãnh đạo soạn thảo (1946, 1959)" />
          <Count to={16} label="đạo luật ký lệnh công bố" />
          <Count to={613} label="sắc lệnh đã ký" />
          <Count to={243} label="sắc lệnh về tổ chức Nhà nước & pháp luật" />
        </motion.div>
        <div className="two">
          <Bullets
            items={['Làm tốt công tác lập pháp', 'Đưa pháp luật vào cuộc sống', 'Giáo dục ý thức tôn trọng pháp luật', 'Cán bộ phải gương mẫu tuân thủ pháp luật']}
          />
          <Quote big cite={`Thư gửi Hội nghị tư pháp toàn quốc — ${TT(5, 473)}`}>
            Phụng công, thủ pháp, chí công, vô tư.
          </Quote>
        </div>
      </Shell>
    ),
  },
  {
    id: 'nhan-nghia',
    section: 'p1',
    label: '6. Pháp quyền nhân nghĩa',
    render: () => (
      <Shell kicker="2.c · GT tr. 85 – 86" title="6. Pháp quyền nhân nghĩa là gì?">
        <motion.div className="formula" variants={stagger}>
          <Item className="formula__term">Pháp luật nghiêm minh</Item>
          <Item className="formula__op">+</Item>
          <Item className="formula__term">Tôn trọng con người</Item>
          <Item className="formula__op">+</Item>
          <Item className="formula__term">Bảo vệ lợi ích chính đáng của nhân dân</Item>
        </motion.div>
        <div className="two">
          <Bullets
            items={[
              'Tôn trọng, bảo đảm đầy đủ quyền con người',
              'Pháp luật có tính nhân văn, khuyến thiện',
              'Lấy giáo dục, cảm hóa làm căn bản',
            ]}
          />
          <Quote cite={TT(6, 437)}>
            Chính phủ Việt Nam sẽ tha thứ hay trừng trị họ theo luật pháp… Nhưng sẽ không có ai bị tàn sát.
          </Quote>
        </div>
      </Shell>
    ),
  },
  {
    id: 'chuoi',
    section: 'p1',
    label: '7. Liên hệ nhà nước phục vụ nhân dân',
    render: () => (
      <Shell kicker="Tổng hợp Phần I – II" title="7. Các ý trên liên quan thế nào tới một nhà nước phục vụ nhân dân?">
        <motion.div className="chain" variants={stagger}>
          {[
            ['Của nhân dân', 'Dân là chủ thể quyền lực'],
            ['Do nhân dân', 'Dân lập nên & tham gia'],
            ['Vì nhân dân', 'Phục vụ lợi ích của dân'],
            ['Hợp hiến, hợp pháp', 'Theo Hiến pháp, pháp luật'],
            ['Thượng tôn pháp luật', 'Cả Nhà nước cũng phải tuân thủ'],
            ['Pháp quyền nhân nghĩa', 'Nghiêm minh mà vì con người'],
          ].map(([t, d], i) => (
            <Item key={t} className="chain__node" style={{ '--i': i }}>
              <span className="chain__no">{i + 1}</span>
              <b>{t}</b>
              <small>{d}</small>
            </Item>
          ))}
        </motion.div>
        <Item as="p" className="conclude">
          → Nhà nước phục vụ nhân dân phải vận hành <b>trong khuôn khổ Hiến pháp, pháp luật</b> — nhưng pháp luật là để{' '}
          <b>bảo vệ con người</b>.
        </Item>
      </Shell>
    ),
  },
  /* ===== PHẦN II · HOÀI ANH ===== */
  {
    id: 'tt',
    section: 'tt',
    label: 'Phần II',
    pose: 'section',
    render: () => (
      <Divider roman="II" title="Hỏi nhanh & tình huống công vụ" sub="4 câu trắc nghiệm · 4 tình huống — mời các bạn cùng trả lời" pages="Tương tác" by="Hoài Anh" time="6 – 7 phút" />
    ),
  },
  {
    id: 'quiz',
    section: 'tt',
    label: 'Trắc nghiệm nhanh',
    pose: 'quiz',
    render: () => (
      <Shell kicker="Câu hỏi Kahoot · mời một bạn trả lời" title="Hỏi nhanh — đáp gọn">
        <Item>
          <Quiz />
        </Item>
      </Shell>
    ),
  },
  {
    id: 'tinh-huong',
    section: 'tt',
    label: 'Tình huống công vụ',
    render: () => (
      <Shell kicker="Tình huống · hỏi lớp trước, rồi bấm thẻ để lật" title="Nếu là cán bộ, bạn xử lý thế nào?">
        <motion.div className="flips" variants={stagger}>
          <FlipCard
            label="Tình huống 1"
            front={<b>Doanh nghiệp tặng quà, xin xử lý hồ sơ nhanh hơn</b>}
            back="Giải quyết theo quy định — không dựa trên lợi ích cá nhân."
          />
          <FlipCard
            label="Tình huống 2"
            front={<b>Người quen thiếu giấy tờ, nhờ “bỏ qua” quy trình</b>}
            back="Quan hệ cá nhân không thay thế yêu cầu và quy trình công vụ."
          />
          <FlipCard
            label="Tình huống 3"
            front={<b>Cấp trên chỉ đạo trái pháp luật</b>}
            back="Kỷ luật tổ chức phải trong khuôn khổ pháp luật — thực hiện cơ chế báo cáo theo quy định."
          />
          <FlipCard
            label="Tình huống 4"
            front={<b>Được nhờ cung cấp dữ liệu nội bộ vì lợi ích riêng</b>}
            back="Thông tin công vụ phải dùng đúng mục đích, đúng quy định."
          />
        </motion.div>
      </Shell>
    ),
  },
  /* ===== PHẦN III · LONG ===== */
  {
    id: 'p3',
    section: 'p3',
    label: 'Phần III',
    pose: 'section',
    render: () => (
      <Divider
        roman="III"
        title="Kiểm soát quyền lực, kỷ cương & đạo đức công vụ"
        sub="Nhà nước trong sạch, vững mạnh"
        pages="GT tr. 86 – 89"
        by="Long"
        time="8 – 9 phút"
      />
    ),
  },
  {
    id: 'kiem-soat',
    section: 'p3',
    label: '1. Kiểm soát quyền lực',
    render: () => (
      <Split kicker="3.a · Kiểm soát quyền lực · GT tr. 86 – 87" title="1. Vì sao phải kiểm soát quyền lực nhà nước?" img={M.giamSat}>
        <Quote cite={TT(4, 51)}>…nên khi nắm được chút quyền trong tay vẫn hay lạm dụng.</Quote>
        <Item as="p" className="lead">
          Kiểm soát quyền lực là <b>tất yếu</b> — quyền lực do dân ủy thác, nhưng người nắm quyền đều có thể lạm quyền.
        </Item>
        <Cards
          cols={3}
          items={[
            { t: 'Đảng kiểm tra', d: 'người kiểm soát phải có uy tín; “khéo kiểm soát”' },
            { t: 'Quốc hội giám sát', d: 'HP 1946: “Kiểm soát và phê bình Chính phủ”' },
            { t: 'Nhân dân kiểm soát', d: '“phải có quần chúng giúp mới được”' },
          ]}
        />
      </Split>
    ),
  },
  {
    id: 'tieu-cuc',
    section: 'p3',
    label: '2. Biểu hiện tiêu cực',
    render: () => (
      <Shell kicker="3.b · Phòng, chống tiêu cực · GT tr. 88 – 89" title="2. Những biểu hiện tiêu cực cần phòng chống">
        <motion.div className="ills" variants={stagger}>
          {[
            ['Đặc quyền, đặc lợi', 'Cậy mình là người của chính quyền để cửa quyền, hách dịch, vơ vét'],
            ['Tham ô, lãng phí, quan liêu', '“Giặc nội xâm”, “giặc ở trong lòng” — nguy hiểm hơn giặc ngoại xâm'],
            ['Tư túng, chia rẽ, kiêu ngạo', 'Kéo bè kéo cánh, mất đoàn kết, “quan cách mạng”'],
          ].map(([t, d]) => (
            <Item key={t} className="ill">
              <h3>{t}</h3>
              <p>{d}</p>
            </Item>
          ))}
        </motion.div>
        <div className="two">
          <Quote cite={TT(7, '357-358')}>
            Tham ô, lãng phí và bệnh quan liêu, dù cố ý hay không, cũng là bạn đồng minh của thực dân và phong kiến.
          </Quote>
          <motion.div className="facts" variants={stagger}>
            <Item className="fact">
              <b>27/11/1946</b> Sắc lệnh: tội đưa &amp; nhận hối lộ — 5 đến 20 năm tù khổ sai, phạt gấp đôi số tiền nhận
            </Item>
            <Item className="fact">
              <b>Quan liêu</b> là “bệnh gốc” sinh ra tham ô, lãng phí
            </Item>
          </motion.div>
        </div>
      </Shell>
    ),
  },
  {
    id: 'ky-cuong',
    section: 'p3',
    label: '3. “Kỷ cương” hiểu thế nào',
    render: () => (
      <Shell kicker="Kỷ cương · GT tr. 86 – 87 & tài liệu nhóm" title="3. “Kỷ cương” trong bài nên hiểu như thế nào?">
        <Item as="p" className="lead">
          Tuân thủ <b>Hiến pháp, pháp luật</b>, nguyên tắc tổ chức và <b>trách nhiệm công vụ</b>; chịu kiểm tra, giám
          sát; đặt lợi ích nhân dân trên lợi ích cá nhân.
        </Item>
        <motion.div className="fourway" variants={stagger}>
          {['nhiệm vụ', 'thẩm quyền', 'quy trình', 'trách nhiệm'].map((w) => (
            <Item key={w} className="fourway__tile">
              <small>Đúng</small>
              <b>{w}</b>
            </Item>
          ))}
        </motion.div>
        <Bullets items={['Không né tránh, đùn đẩy trách nhiệm', 'Không tự ý bỏ qua hay thay đổi quy trình', 'Báo cáo và xử lý khi phát hiện vi phạm']} />
      </Shell>
    ),
  },
  {
    id: 'triad',
    section: 'p3',
    label: 'Mối quan hệ ba yếu tố',
    render: () => (
      <Shell kicker="Pháp quyền · Kỷ cương · Đạo đức" title="Ba yếu tố bổ trợ cho nhau">
        <motion.div className="triad" variants={stagger}>
          {[
            ['Pháp quyền', 'Khuôn khổ', 'Tạo ra giới hạn của quyền lực'],
            ['Kỷ cương', 'Thực thi', 'Bảo đảm giới hạn đó được tôn trọng'],
            ['Đạo đức công vụ', 'Hành vi', 'Định hướng dùng quyền lực có trách nhiệm, liêm chính'],
          ].map(([t, k, d], i) => (
            <Item key={t} className="pillar" style={{ '--i': i }}>
              <span className="pillar__key">{k}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Item>
          ))}
        </motion.div>
      </Shell>
    ),
  },
  {
    id: 'dao-duc',
    section: 'p3',
    label: 'Giá trị đạo đức công vụ',
    render: () => (
      <Shell kicker="Đạo đức công vụ" title="Đạo đức công vụ — 5 giá trị cơ bản">
        <Cards
          cols={5}
          items={[
            { t: 'Liêm chính', d: 'Không lợi dụng chức vụ để trục lợi' },
            { t: 'Trách nhiệm', d: 'Chủ động, chịu trách nhiệm về quyết định' },
            { t: 'Công bằng', d: 'Không ưu ái vì quan hệ cá nhân' },
            { t: 'Tận tụy', d: 'Tinh thần phục vụ người dân' },
            { t: 'Tôn trọng', d: 'Quyền, lợi ích hợp pháp của dân' },
          ]}
        />
      </Shell>
    ),
  },
  {
    id: 'trach-nhiem',
    section: 'p3',
    label: 'Công vụ có trách nhiệm',
    render: () => (
      <Shell kicker="Tổng hợp" title="Biểu hiện của công vụ có trách nhiệm">
        <Cards
          cols={3}
          items={[
            { t: 'Đúng pháp luật', d: 'Không vượt thẩm quyền, không trái quy định' },
            { t: 'Đúng quy trình', d: 'Thống nhất, minh bạch' },
            { t: 'Công bằng', d: 'Không để quan hệ riêng quyết định' },
            { t: 'Liêm chính', d: 'Không dùng chức vụ tạo lợi ích riêng' },
            { t: 'Có trách nhiệm', d: 'Không né tránh, đùn đẩy' },
            { t: 'Phục vụ người dân', d: 'Tôn trọng, hướng dẫn, giải quyết yêu cầu hợp pháp' },
          ]}
        />
      </Shell>
    ),
  },
  /* ===== PHẦN IV · TOÀN ===== */
  {
    id: 'p4',
    section: 'p4',
    label: 'Phần IV',
    pose: 'section',
    render: () => <Divider roman="IV" title="Nghiêm minh & nêu gương" sub="Phòng, chống tiêu cực · câu chuyện vụ án Trần Dụ Châu" pages="GT tr. 89 – 90" by="Toàn" time="7 – 8 phút" />,
  },
  {
    id: 'nghiem-minh',
    section: 'p4',
    label: '4. Nghiêm minh ≠ chỉ xử phạt',
    render: () => (
      <Shell kicker="3.b · Biện pháp phòng, chống · GT tr. 89 – 90" title="4. Vì sao nghiêm minh không có nghĩa là chỉ dựa vào xử phạt?">
        <motion.ol className="steps" variants={stagger}>
          {[
            ['Dân chủ', 'Thực hành dân chủ rộng rãi — giải pháp căn bản, lâu dài'],
            ['Pháp luật nghiêm', '“Trăm đều phải có thần linh pháp quyền”, không vùng cấm'],
            ['Giáo dục là chủ yếu', 'Phạt đúng người đúng tội, nhưng lấy cảm hóa làm chính'],
            ['Nêu gương', 'Chức vụ càng cao, trách nhiệm nêu gương càng lớn'],
            ['Yêu nước', 'Huy động sức mạnh chủ nghĩa yêu nước chống tiêu cực'],
          ].map(([t, d], i) => (
            <Item as="li" key={t} className="step">
              <span className="step__no">{i + 1}</span>
              <b>{t}</b>
              <small>{d}</small>
            </Item>
          ))}
        </motion.ol>
        <Quote cite="Giáo trình tr. 89">
          …làm cho cái tốt trong mỗi người nảy nở như hoa mùa Xuân và cái xấu mất dần đi.
        </Quote>
      </Shell>
    ),
  },
  {
    id: 'neu-guong',
    section: 'p4',
    label: '5. Giáo dục & nêu gương',
    render: () => (
      <Split
        kicker="3.b · Nêu gương · GT tr. 89 – 90"
        title="5. Vai trò của giáo dục, đạo đức, trách nhiệm và nêu gương"
        img={webImg('nha-san-bac-ho-vne.webp') ?? M.canBo}
        reverse
      >
        <Cards
          cols={3}
          items={[
            { t: 'Đạo đức', d: 'Đặt lợi ích nhân dân, đất nước lên trên lợi ích cá nhân' },
            { t: 'Trách nhiệm', d: 'Tận tụy với công việc được giao' },
            { t: 'Nêu gương', d: 'Người đứng đầu gương mẫu trong lời nói và hành động' },
          ]}
        />
        <Quote cite={TT(6, 127)}>
          Dù to hay nhỏ, có quyền mà thiếu lương tâm là có dịp đục khoét, có dịp ăn của đút, có dịp “dĩ công vi tư”.
        </Quote>
      </Split>
    ),
  },
  {
    id: 'tra-loi',
    section: 'p4',
    label: '6. Trả lời câu hỏi trung tâm',
    render: () => (
      <Split kicker="Kết luận" title="6. Phần này trả lời gì cho câu hỏi trung tâm của nhóm?" img={webImg('bac-ho-voi-can-bo-xa-1961.png') ?? M.ganDan}>
        <motion.div className="pyramid" variants={stagger}>
          <Item className="pyramid__row">
            <b>Pháp luật</b> tạo khuôn khổ quản lý xã hội
          </Item>
          <Item className="pyramid__row">
            <b>Kỷ cương</b> bảo đảm pháp luật được thực thi nghiêm túc
          </Item>
          <Item className="pyramid__row">
            <b>Đạo đức công vụ</b> giúp người thực thi quyền lực hành động vì dân
          </Item>
        </motion.div>
        <Item as="p" className="conclude">
          → Nền công vụ <b>đúng pháp luật – có kỷ luật – có trách nhiệm – liêm chính – công bằng – phục vụ Nhân dân</b>.
        </Item>
        <Item as="p" className="lead lead--sm">
          Liên hệ sinh viên: tôn trọng quy định, trung thực trong học tập và thi cử, không vì quan hệ riêng mà bỏ qua nguyên tắc.
        </Item>
      </Split>
    ),
  },
  /* ===== KẾT ===== */
  {
    id: 'gallery',
    section: 'end',
    label: 'Tư liệu hình ảnh',
    render: () => (
      <Shell kicker="Kéo hoặc rê chuột để xoay" title="Tư liệu hình ảnh">
        <Item>
          <Gallery3D images={ALL_IMAGES.filter((i) => !i.width || i.width / i.height < 2.5)} />
        </Item>
      </Shell>
    ),
  },
  {
    id: 'refs',
    section: 'end',
    label: 'Tài liệu tham khảo & nguồn',
    render: () => (
      <Shell kicker="Minh bạch nguồn" title="Tài liệu tham khảo & nguồn ảnh" className="refs">
        <Item className="refs__cols scrollable">
          <div>
            <h3>Tài liệu</h3>
            <ol>
              <li>{TEXTBOOK_REF}</li>
              <li>Hồ Chí Minh, Toàn tập, Nxb Chính trị quốc gia, Hà Nội, 2011 (trích dẫn theo giáo trình).</li>
              <li>Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam năm 2013.</li>
              <li>Luật Cán bộ, công chức số 80/2025/QH15.</li>
              <li>Nhóm 6 — TÀI LIỆU PHÁT TRIỂN (tài liệu nội bộ của nhóm).</li>
            </ol>
            {usedStories().length > 0 && (
              <>
                <h3>Câu chuyện dẫn dắt</h3>
                <ol>
                  {usedStories().flatMap((s) => s.sources).map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noreferrer">
                        {s.name} — {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
          <div>
            <h3>Hình ảnh</h3>
            <ol>
              {ALL_IMAGES.map((img) => (
                <li key={img.file}>
                  {img.caption}. <SourceLink img={img} />
                </li>
              ))}
            </ol>
            <p className="refs__note">Tất cả hình ảnh là ảnh tư liệu từ các nguồn trên — không sử dụng ảnh do AI tạo.</p>
          </div>
        </Item>
      </Shell>
    ),
  },
  {
    id: 'ai-usage',
    section: 'end',
    label: 'AI Usage',
    render: () => (
      <Shell kicker="Khai báo sử dụng AI" title="AI Usage" className="ai">
        <Item className="ai__badge">
          <span className="ai__dot" />
          Công cụ AI duy nhất: <b>{AI_USAGE.tool}</b>
        </Item>
        <Item as="p" className="lead">
          {AI_USAGE.statement}
        </Item>
        <div className="two">
          <Item className="ai__box">
            <h3>Claude hỗ trợ</h3>
            <ul>
              {AI_USAGE.usedFor.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Item>
          <Item className="ai__box ai__box--no">
            <h3>Cam kết</h3>
            <ul>
              {AI_USAGE.notUsedFor.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Item>
        </div>
      </Shell>
    ),
  },
  {
    id: 'thanks',
    section: 'end',
    label: 'Cảm ơn',
    pose: 'hero',
    render: () => (
      <motion.div className="cover" variants={stagger} initial="hidden" animate="show">
        <Item className="cover__badge">
          {COURSE.group} · {COURSE.className} · GV {COURSE.lecturer}
        </Item>
        <Item as="h1" className="cover__title">
          Cảm ơn <em>thầy</em>
          <br />
          và các bạn!
        </Item>
        <Item as="p" className="cover__sub">
          “Phụng công, thủ pháp, chí công, vô tư.”
        </Item>
      </motion.div>
    ),
  },
]

/* Chèn slide câu chuyện (từ stories.json) ngay sau slide có nội dung liên quan */
const STORY_AFTER = {}
export function registerStory(afterId, storyId, imageFile, hook) {
  STORY_AFTER[afterId] = [...(STORY_AFTER[afterId] ?? []), { storyId, imageFile, hook }]
}

const usedStories = () =>
  Object.values(STORY_AFTER)
    .flat()
    .map(({ storyId }) => STORIES.find((x) => x.id === storyId))
    .filter(Boolean)

export function buildSlides() {
  const out = []
  for (const s of base) {
    out.push(s)
    for (const { storyId, imageFile, hook } of STORY_AFTER[s.id] ?? []) {
      const story = STORIES.find((x) => x.id === storyId)
      if (!story) continue
      const img = imageFile ? webImg(imageFile) : undefined
      out.push({
        id: `story-${storyId}`,
        section: s.section,
        label: `Câu chuyện: ${story.title}`,
        render: () => <Story story={story} img={img} hook={hook ?? story.narration} />,
      })
    }
  }
  return out
}

