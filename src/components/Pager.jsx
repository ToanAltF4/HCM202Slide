import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize, NotebookText } from 'lucide-react'

const pad = (n) => String(n).padStart(2, '0')

export default function Pager({ slides, sections, index, go, onOverview, isFull, onFull, onNotes, notesOpen }) {
  const current = slides[index]
  const sec = sections.find((s) => s.id === current.section)
  const progress = slides.length > 1 ? index / (slides.length - 1) : 1

  return (
    <>
      <div className="progress" aria-hidden="true">
        <motion.span
          className="progress__bar"
          animate={{ scaleX: progress }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
      </div>

      <nav className="pager" aria-label="Điều hướng slide">
        <div className="pager__section">
          <AnimatePresence mode="wait">
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <span className="pager__roman">{sec.roman}</span>
              <span className="pager__who">{sec.presenter}</span>
              <span className="pager__name">{sec.name}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <ol className="pager__track">
          {sections.map((s) => {
            const items = slides.map((sl, i) => ({ sl, i })).filter(({ sl }) => sl.section === s.id)
            const active = s.id === current.section
            return (
              <li key={s.id} className={`pager__group ${active ? 'is-active' : ''}`}>
                <span className="pager__glabel">{s.roman}</span>
                <div className="pager__ticks">
                  {items.map(({ sl, i }) => (
                    <button
                      key={sl.id}
                      type="button"
                      className={`tick ${i === index ? 'is-current' : ''} ${i < index ? 'is-past' : ''}`}
                      onClick={() => go(i)}
                      aria-label={`Slide ${i + 1}: ${sl.label}`}
                      aria-current={i === index ? 'step' : undefined}
                    >
                      <span className="tick__bar" />
                      <span className="tick__tip">
                        <b>{pad(i + 1)}</b> {sl.label}
                      </span>
                    </button>
                  ))}
                </div>
              </li>
            )
          })}
        </ol>

        <div className="pager__controls">
          <button type="button" className="pbtn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Slide trước">
            <ChevronLeft size={18} />
          </button>
          <div className="counter" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={index}
                className="counter__now"
                initial={{ y: 18, opacity: 0, rotateX: -80 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: -18, opacity: 0, rotateX: 80 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                {pad(index + 1)}
              </motion.span>
            </AnimatePresence>
            <span className="counter__total">/ {pad(slides.length)}</span>
          </div>
          <button
            type="button"
            className="pbtn pbtn--primary"
            onClick={() => go(index + 1)}
            disabled={index === slides.length - 1}
            aria-label="Slide tiếp"
          >
            <ChevronRight size={18} />
          </button>
          <span className="pager__sep" />
          <button
            type="button"
            className={`pbtn ${notesOpen ? 'is-on' : ''}`}
            onClick={onNotes}
            aria-label="Lời thoại (N)"
            title="Lời thoại (N)"
          >
            <NotebookText size={16} />
          </button>
          <button type="button" className="pbtn" onClick={onOverview} aria-label="Xem tổng quan (G)" title="Tổng quan (G)">
            <LayoutGrid size={16} />
          </button>
          <button type="button" className="pbtn" onClick={onFull} aria-label="Toàn màn hình (F)" title="Toàn màn hình (F)">
            {isFull ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </nav>
    </>
  )
}

export function Overview({ slides, sections, index, go, onClose }) {
  return (
    <motion.div
      className="overview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-label="Tổng quan slide"
    >
      <div className="overview__inner" onClick={(e) => e.stopPropagation()}>
        <header className="overview__head">
          <h2>Tổng quan bài trình bày</h2>
          <button type="button" className="pbtn" onClick={onClose}>
            Đóng · Esc
          </button>
        </header>
        {sections.map((s) => (
          <section key={s.id} className="overview__sec">
            <h3>
              <span>{s.roman}</span> {s.name} <em>· {s.presenter}</em>
            </h3>
            <div className="overview__grid">
              {slides.map((sl, i) =>
                sl.section !== s.id ? null : (
                  <motion.button
                    key={sl.id}
                    type="button"
                    className={`ocard ${i === index ? 'is-current' : ''}`}
                    onClick={() => {
                      go(i)
                      onClose()
                    }}
                    initial={{ opacity: 0, y: 20, rotateX: -30 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: Math.min(i * 0.015, 0.4) }}
                    whileHover={{ y: -4, rotateX: 6 }}
                  >
                    <span className="ocard__no">{pad(i + 1)}</span>
                    <span className="ocard__label">{sl.label}</span>
                  </motion.button>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  )
}
