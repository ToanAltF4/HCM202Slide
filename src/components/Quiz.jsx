import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { QUIZ } from '../data/quiz'

const LETTERS = ['A', 'B', 'C', 'D']

export default function Quiz() {
  const [idx, setIdx] = useState(0)
  // picked[i] = tập các đáp án đã bấm ở câu i
  const [picked, setPicked] = useState(() => QUIZ.map(() => []))
  const q = QUIZ[idx]
  const mine = picked[idx]
  const solved = mine.includes(q.answer)

  const choose = (o) => {
    if (solved || mine.includes(o)) return
    setPicked((p) => p.map((arr, i) => (i === idx ? [...arr, o] : arr)))
  }

  return (
    <div className="quiz">
      <div className="quiz__tabs" role="tablist">
        {QUIZ.map((item, i) => {
          const done = picked[i].includes(item.answer)
          return (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              className={`quiz__tab ${i === idx ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setIdx(i)
              }}
            >
              Câu {i + 1}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="quiz__body"
          initial={{ opacity: 0, rotateY: -25, x: 40 }}
          animate={{ opacity: 1, rotateY: 0, x: 0 }}
          exit={{ opacity: 0, rotateY: 25, x: -40 }}
          transition={{ type: 'spring', stiffness: 140, damping: 20 }}
        >
          <h3 className="quiz__q">{q.q}</h3>
          <div className="quiz__options">
            {q.options.map((opt, o) => {
              const state = mine.includes(o) ? (o === q.answer ? 'right' : 'wrong') : ''
              return (
                <motion.button
                  key={o}
                  type="button"
                  className={`quiz__opt ${state ? `is-${state}` : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    choose(o)
                  }}
                  whileHover={!solved ? { y: -3 } : undefined}
                  whileTap={{ scale: 0.97 }}
                  animate={state === 'wrong' ? { x: [0, -10, 10, -6, 6, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  disabled={solved && !state}
                >
                  <span className="quiz__letter">{LETTERS[o]}</span>
                  <span className="quiz__text">{opt}</span>
                  {state === 'right' && <Check className="quiz__icon" aria-label="Đúng" />}
                  {state === 'wrong' && <X className="quiz__icon" aria-label="Sai" />}
                </motion.button>
              )
            })}
          </div>
          <p className="quiz__hint" aria-live="polite">
            {solved ? 'Chính xác! 🎉' : mine.length ? 'Chưa đúng — thử đáp án khác' : 'Mời một bạn trả lời, rồi bấm vào đáp án'}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
