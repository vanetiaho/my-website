import { Suspense, lazy, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Cursor from './components/Cursor/Cursor'
import AmbientBackground from './components/AmbientBackground/AmbientBackground'
import Navbar from './components/Navbar/Navbar'
import FlightProgress from './components/FlightProgress/FlightProgress'
import Entrance from './components/Entrance/Entrance'
import PageTransition from './components/PageTransition/PageTransition'
import { useAppStore } from './store/useAppStore'

const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Music = lazy(() => import('./pages/Music'))
const Play = lazy(() => import('./pages/Play'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sunset-amber/30 border-t-sunset-amber" />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const hasEntered = useAppStore((s) => s.hasEntered)
  const [entering, setEntering] = useState(!hasEntered)

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-sunset-amber focus:px-4 focus:py-2 focus:text-base-950"
      >
        Skip to content
      </a>

      <AmbientBackground />
      <Cursor />

      <AnimatePresence>
        {entering && <Entrance onDone={() => setEntering(false)} />}
      </AnimatePresence>

      {!entering && (
        <>
          <Navbar />
          <FlightProgress />
          <main id="main-content">
            <Suspense fallback={<RouteFallback />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route
                    path="/"
                    element={
                      <PageTransition>
                        <Home />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <PageTransition>
                        <Projects />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/music"
                    element={
                      <PageTransition>
                        <Music />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/play"
                    element={
                      <PageTransition>
                        <Play />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <PageTransition>
                        <Contact />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <PageTransition>
                        <NotFound />
                      </PageTransition>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>
        </>
      )}
    </>
  )
}
