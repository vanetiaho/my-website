import './styles/globals.css'
import './styles/animations.css'
import { useState } from 'react'
import Cursor from './components/Cursor/Cursor'
import Entrance from './components/Entrance/Entrance'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import FlightLog from './components/FlightLog/FlightLog'
import Music from './components/Music/Music'
import Contact from './components/Contact/Contact'
import MiniGame from './components/MiniGame/MiniGame'

function App() {
  const [entered, setEntered] = useState(false)

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Cursor />
      {!entered && <Entrance onEnter={() => setEntered(true)} />}
      {entered && (
        <>
          <Navbar />
          <main id="main">
            <Hero />
            <About />
            <Projects />
            <FlightLog />
            <Music />
            <Contact />
          </main>
          <MiniGame />
        </>
      )}
    </>
  )
}

export default App
