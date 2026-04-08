import { useState } from 'react'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import MoodJournal from './pages/MoodJournal'
import ThoughtRecord from './pages/ThoughtRecord'
import Breathing from './pages/Breathing'
import History from './pages/History'

function App() {
  const [page, setPage] = useState('home')

  const pages = {
    home: <Home onNavigate={setPage} />,
    mood: <MoodJournal />,
    thought: <ThoughtRecord />,
    breathing: <Breathing />,
    history: <History />,
  }

  return (
    <>
      {pages[page]}
      <Navigation current={page} onChange={setPage} />
    </>
  )
}

export default App
