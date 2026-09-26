import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Scene3D from './Scene3D'
import Pager, { Overview } from './Pager'
import Notes from './Notes'

const readHash = (max) => {
  const n = parseInt(window.location.hash.replace('#', ''), 10)
  return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), max - 1) : 0
}

const variants = {
  enter: (dir) => ({ opacity: 0, rotateY: dir * 38, x: `${dir * 18}%`, z: -300, filter: 'blur(6px)' }),
  center: { opacity: 1, rotateY: 0, x: '0%', z: 0, filter: 'blur(0px)' },
  exit: (dir) => ({ opacity: 0, rotateY: dir * -38, x: `${dir * -18}%`, z: -300, filter: 'blur(6px)' }),
}

export default function Deck({ slides, sections }) {
  const [index, setIndex] = useState(() => readHash(slides.length))
  const [dir, setDir] = useState(1)
  const [overview, setOverview] = useState(false)
  const [isFull, setIsFull] = useState(false)
  const [notes, setNotes] = useState(false)
  const lock = useRef(0)

  const go = useCallback(
    (i) => {
      const next = Math.min(Math.max(i, 0), slides.length - 1)
      if (next === index) return
      setDir(next > index ? 1 : -1)
      setIndex(next)
    },
    [index, slides.length],
  )

  useEffect(() => {
    window.history.replaceState(null, '', `#${index + 1}`)
    document.title = `${String(index + 1).padStart(2, '0')} · ${slides[index].label} — HCM202 Nhóm 6`
  }, [index, slides])

  useEffect(() => {
    const onHash = () => go(readHash(slides.length))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [go, slides.length])

  const toggleFull = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
  }, [])

  useEffect(() => {
    const onFs = () => setIsFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return
      const k = e.key
      if (overview) {
        if (k === 'Escape' || k === 'g' || k === 'G') setOverview(false)
        return
      }
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) {
        if (k === 'Enter' && e.target.closest?.('button')) return
        e.preventDefault()
        go(index + 1)
      } else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) {
        e.preventDefault()
        go(index - 1)
      } else if (k === 'Home') go(0)
      else if (k === 'End') go(slides.length - 1)
      else if (k === 'g' || k === 'G' || k === 'Escape') setOverview(k !== 'Escape')
      else if (k === 'f' || k === 'F') toggleFull()
      else if (k === 'n' || k === 'N') setNotes((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index, overview, slides.length, toggleFull])

  // Cuộn chuột / touchpad để chuyển slide
  useEffect(() => {
    const onWheel = (e) => {
      if (overview || e.target.closest?.('.scrollable')) return
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(d) < 24) return
      const now = Date.now()
      if (now - lock.current < 900) return
      lock.current = now
      go(index + (d > 0 ? 1 : -1))
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [go, index, overview])

  // Vuốt trên điện thoại / máy tính bảng
  const touch = useRef(null)
  const onTouchStart = (e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1))
    touch.current = null
  }

  const slide = slides[index]
  const Content = slide.render

  return (
    <div className={`deck theme-${slide.pose ?? 'content'}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="backdrop" aria-hidden="true" />
      <Scene3D pose={slide.pose ?? 'content'} />
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <span className="topbar__brand">
          <b>HCM202</b> · SE1810 · Nhóm 6
        </span>
        <span className="topbar__topic">Kỷ cương &amp; đạo đức công vụ</span>
      </header>

      <main className="stage">
        <AnimatePresence custom={dir} mode="popLayout" initial={false}>
          <motion.section
            key={slide.id}
            className={`slide slide--${slide.pose ?? 'content'}`}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 0.9 }}
            aria-roledescription="slide"
            data-slide={slide.id}
            aria-label={`${index + 1} / ${slides.length}: ${slide.label}`}
          >
            <Content />
          </motion.section>
        </AnimatePresence>
      </main>

      <Pager
        slides={slides}
        sections={sections}
        index={index}
        go={go}
        onOverview={() => setOverview(true)}
        isFull={isFull}
        onFull={toggleFull}
        notesOpen={notes}
        onNotes={() => setNotes((v) => !v)}
      />

      <AnimatePresence>{notes && <Notes slide={slide} index={index} onClose={() => setNotes(false)} />}</AnimatePresence>

      <AnimatePresence>
        {overview && (
          <Overview slides={slides} sections={sections} index={index} go={go} onClose={() => setOverview(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
