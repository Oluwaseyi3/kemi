import { useCallback, useState } from 'react'
import Loader from './components/Loader'
import ScrollTimeline from './components/ScrollTimeline'
import LoveNotes from './components/LoveNotes'

function App() {
  const [loading, setLoading] = useState(true)
  const handleDone = useCallback(() => setLoading(false), [])

  return (
    <>
      {loading && <Loader onDone={handleDone} />}

      <main>
        <header className="flex min-h-screen flex-col items-center justify-center bg-blush px-6 text-center">
          <h1 className="font-serif text-6xl md:text-8xl">For Kemi</h1>
          <p className="mt-8 max-w-md text-lg text-ink/85">
            My queen, my princess, my baby. I love you more than words can ever describe.
          </p>
        </header>
        <ScrollTimeline />
        <LoveNotes />
        <footer className="bg-petal py-16 text-center font-serif text-xl text-ink/85">Forever yours, forever your sweet tooth ♥</footer>
      </main>
    </>
  )
}

export default App
