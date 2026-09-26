import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationFrame, useMotionValue } from 'motion/react'
import { SourceLink } from './ui'

// Vòng ảnh 3D bằng CSS transform: tự xoay, kéo để xoay, bấm để phóng to
export default function Gallery3D({ images }) {
  const n = images.length
  const angle = useMotionValue(0)
  const drag = useRef(null)
  const moved = useRef(false)
  const hover = useRef(false)
  const [front, setFront] = useState(0)
  const [open, setOpen] = useState(null)
  const step = 360 / n
  const radius = Math.max(300, Math.round(128 / Math.tan(Math.PI / n)))

  useAnimationFrame((_, dt) => {
    if (!drag.current && !hover.current && open === null) angle.set(angle.get() - dt * 0.012)
    const a = ((-angle.get() % 360) + 360) % 360
    const f = Math.round(a / step) % n
    if (f !== front) setFront(f)
  })

  useEffect(() => {
    const up = () => (drag.current = null)
    window.addEventListener('pointerup', up)
    return () => window.removeEventListener('pointerup', up)
  }, [])

  return (
    <div className="gallery">
      <div
        className="gallery__stage"
        onPointerEnter={() => (hover.current = true)}
        onPointerLeave={() => (hover.current = false)}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, a: angle.get() }
          moved.current = false
        }}
        onPointerMove={(e) => {
          if (!drag.current) return
          const dx = e.clientX - drag.current.x
          if (Math.abs(dx) > 4) moved.current = true
          angle.set(drag.current.a + dx * 0.25)
        }}
      >
        <motion.div className="gallery__ring" style={{ z: -radius, rotateY: angle }}>
          {images.map((img, i) => (
            <button
              key={img.file}
              type="button"
              className={`gallery__item ${i === front ? 'is-front' : ''}`}
              style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
              onClick={() => !moved.current && setOpen(i)}
              aria-label={img.caption}
            >
              <img src={img.file} alt={img.caption} draggable="false" loading="lazy" />
            </button>
          ))}
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={front}
          className="gallery__caption"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {images[front]?.caption} <SourceLink img={images[front]} />
        </motion.p>
      </AnimatePresence>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.figure
              initial={{ scale: 0.8, rotateX: 20 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={images[open].file} alt={images[open].caption} />
              <figcaption>
                {images[open].caption} <SourceLink img={images[open]} />
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
