import { motion } from 'motion/react'
import { X } from 'lucide-react'
import SCRIPT from '../data/script.json'

const BY_ID = Object.fromEntries(SCRIPT.map((s) => [s.id, s]))

// Bảng lời thoại cho người trình bày (phím N)
export default function Notes({ slide, index, onClose }) {
  const note = BY_ID[slide.id]
  return (
    <motion.aside
      className="notes"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      aria-label="Lời thoại"
    >
      <header className="notes__head">
        <span>
          Slide {index + 1}
          {note && <b> · {note.presenter}</b>}
        </span>
        <button type="button" className="pbtn" onClick={onClose} aria-label="Đóng lời thoại">
          <X size={16} />
        </button>
      </header>
      <div className="notes__body scrollable">
        {note ? note.text.map((t) => <p key={t}>{t}</p>) : <p>Chưa có lời thoại cho slide này.</p>}
      </div>
    </motion.aside>
  )
}
