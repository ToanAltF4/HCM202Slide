import Deck from './components/Deck'
import QuestionsPage from './components/QuestionsPage'
import { SECTIONS, buildSlides } from './data/slides'
import './data/stories.config'

const SLIDES = buildSlides()
const isQuestions = window.location.pathname.replace(/\/+$/, '') === '/question'

export default function App() {
  return isQuestions ? <QuestionsPage /> : <Deck slides={SLIDES} sections={SECTIONS} />
}
