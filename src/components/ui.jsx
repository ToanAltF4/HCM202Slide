import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
}
export const rise = {
  hidden: { opacity: 0, y: 26, rotateX: -18 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
}

export function Shell({ kicker, title, children, className = '' }) {
  return (
    <motion.div className={`shell ${className}`} variants={stagger} initial="hidden" animate="show">
      {kicker && (
        <motion.p className="kicker" variants={rise}>
          {kicker}
        </motion.p>
      )}
      {title && (
        <motion.h2 className="title" variants={rise}>
          {title}
        </motion.h2>
      )}
      {children}
    </motion.div>
  )
}

export const Item = ({ as = 'div', className, children, ...rest }) => {
  const C = motion[as]
  return (
    <C className={className} variants={rise} {...rest}>
      {children}
    </C>
  )
}

export function SourceLink({ img }) {
  if (!img?.sourceUrl) return null
  return (
    <a className="source" href={img.sourceUrl} target="_blank" rel="noreferrer" title={img.sourceTitle}>
      Nguồn: {img.sourceName}
    </a>
  )
}

// Ảnh nghiêng 3D theo chuột + chú thích + nguồn
export function Figure({ img, className = '', tall = false }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 160, damping: 16 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 160, damping: 16 })
  const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%'])
  if (!img) return null
  return (
    <motion.figure
      className={`figure ${tall ? 'figure--tall' : ''} ${className}`}
      variants={rise}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <motion.div className="figure__card" style={{ rotateX: rx, rotateY: ry }}>
        <img src={img.file} alt={img.caption} loading="lazy" draggable="false" />
        <motion.span className="figure__glare" style={{ left: glareX }} />
      </motion.div>
      <figcaption>
        <span>{img.caption}</span>
        <SourceLink img={img} />
      </figcaption>
    </motion.figure>
  )
}

export function Quote({ children, cite, big = false }) {
  return (
    <Item as="blockquote" className={`quote ${big ? 'quote--big' : ''}`}>
      <span className="quote__mark">“</span>
      <p>{children}</p>
      {cite && <cite>— {cite}</cite>}
    </Item>
  )
}

export function Cards({ items, cols = 3 }) {
  return (
    <motion.div className="cards" style={{ '--cols': cols }} variants={stagger}>
      {items.map((it, i) => (
        <Item key={it.t} className="card">
          <span className="card__no">{String(i + 1).padStart(2, '0')}</span>
          <h3>{it.t}</h3>
          {it.d && <p>{it.d}</p>}
        </Item>
      ))}
    </motion.div>
  )
}

export function Bullets({ items }) {
  return (
    <motion.ul className="bullets" variants={stagger}>
      {items.map((b) => (
        <Item as="li" key={b}>
          {b}
        </Item>
      ))}
    </motion.ul>
  )
}

export function FlipCard({ front, back, label }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <Item className="flip">
      <button
        type="button"
        className={`flip__inner ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
      >
        <span className="flip__face flip__front">
          <em>{label}</em>
          {front}
          <small>Bấm để xem nguyên tắc ↻</small>
        </span>
        <span className="flip__face flip__back">{back}</span>
      </button>
    </Item>
  )
}
