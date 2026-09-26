import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Shuffle, X } from 'lucide-react'
import Scene3D from './Scene3D'
import QUESTIONS from '../data/questions.json'

// Chỉ lấy câu hỏi — đáp án nằm trong docs, không hiển thị cho người xem
const LIST = QUESTIONS.map((x, i) => ({ no: i + 1, q: x.q }))
const pad = (n) => String(n).padStart(2, '0')

const STORE_KEY = 'hcm202-asked'
const loadAsked = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export default function QuestionsPage() {
  const [asked, setAsked] = useState(loadAsked)
  const [picked, setPicked] = useState(null) // câu đang phóng to
  const [card, setCard] = useState({ no: null, flipped: false, spin: 0 })

  useEffect(() => {
    document.title = 'Câu hỏi cho Nhóm 6 — HCM202'
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify([...asked]))
    } catch {
      /* bỏ qua khi trình duyệt chặn lưu trữ */
    }
  }, [asked])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setPicked(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const markAsked = (no) => setAsked((s) => new Set(s).add(no))

  const flipRandom = () => {
    const pool = LIST.filter((x) => !asked.has(x.no) && x.no !== card.no)
    const from = pool.length ? pool : LIST.filter((x) => x.no !== card.no)
    const next = from[Math.floor(Math.random() * from.length)]
    setCard((c) => ({ no: next.no, flipped: true, spin: c.spin + 1 }))
    markAsked(next.no)
  }

  const current = LIST.find((x) => x.no === card.no)

  return (
    <div className="qpage">
      <div className="backdrop" aria-hidden="true" />
      <Scene3D pose="content" />
      <div className="qpage__scroll">
        <header className="qpage__head">
          <a className="pbtn qpage__back" href="/#1">
            <ArrowLeft size={16} /> Về slide
          </a>
          <p className="kicker">HCM202 · SE1810 · Nhóm 6</p>
          <h1 className="title">Câu hỏi dành cho Nhóm 6</h1>
          <p className="lead">
            Chọn một trong {LIST.length} câu hỏi bên dưới, hoặc lật thẻ để nhận một câu hỏi ngẫu nhiên — rồi hỏi nhóm nhé.
          </p>
        </header>

        <section className="qrandom">
          <div className="qflip" onClick={flipRandom} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && flipRandom()}>
            <motion.div
              className="qflip__inner"
              animate={{ rotateY: card.flipped ? 180 + card.spin * 360 : 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            >
              <div className="qflip__face qflip__front">
                <span className="qflip__mark">?</span>
                <b>Lật câu hỏi ngẫu nhiên</b>
                <small>Bấm vào thẻ</small>
              </div>
              <div className="qflip__face qflip__back">
                {current && (
                  <>
                    <span className="qflip__no">Câu {pad(current.no)}</span>
                    <p>{current.q}</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
          <button type="button" className="pbtn pbtn--primary qrandom__btn" onClick={flipRandom}>
            <Shuffle size={16} /> {card.flipped ? 'Lật câu khác' : 'Lật ngẫu nhiên'}
          </button>
        </section>

        <section className="qlist">
          <div className="qlist__head">
            <h2>Danh sách {LIST.length} câu hỏi</h2>
            <span>
              Đã chọn {asked.size}/{LIST.length}
              {asked.size > 0 && (
                <button type="button" className="qlist__reset" onClick={() => setAsked(new Set())}>
                  Làm mới
                </button>
              )}
            </span>
          </div>
          <div className="qgrid">
            {LIST.map((x, i) => (
              <motion.button
                key={x.no}
                type="button"
                className={`qcard ${asked.has(x.no) ? 'is-asked' : ''}`}
                onClick={() => {
                  setPicked(x)
                  markAsked(x.no)
                }}
                initial={{ opacity: 0, y: 20, rotateX: -25 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                whileHover={{ y: -4 }}
              >
                <span className="qcard__no">{pad(x.no)}</span>
                <span className="qcard__q">{x.q}</span>
              </motion.button>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {picked && (
          <motion.div
            className="qmodal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPicked(null)}
          >
            <motion.div
              className="qmodal__card"
              initial={{ rotateY: -90, scale: 0.8 }}
              animate={{ rotateY: 0, scale: 1 }}
              exit={{ rotateY: 90, scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="pbtn qmodal__close" onClick={() => setPicked(null)} aria-label="Đóng">
                <X size={16} />
              </button>
              <span className="qflip__no">Câu {pad(picked.no)}</span>
              <p>{picked.q}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
