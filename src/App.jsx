import Deck from './components/Deck'
import { SECTIONS, buildSlides } from './data/slides'
import './data/stories.config'

const SLIDES = buildSlides()

export default function App() {
  return <Deck slides={SLIDES} sections={SECTIONS} />
}
