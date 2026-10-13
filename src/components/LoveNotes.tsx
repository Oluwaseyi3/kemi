import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// TODO: replace with your own reasons
const NOTES: string[] = [
  "I can't wait to marry you next year and spend the rest of my life with you.",
  'I love how you spend time with me.',
  "You're an amazing and beautiful lover.",
  'I want to build a family with you, forever.',
  "I can't wait to make cute babies with you.",
  "I'm loving this phase of our relationship, on the way to marriage.",
]

function pickNext(prev: number, length: number) {
  if (length < 2) return 0
  let n = prev
  while (n === prev) n = Math.floor(Math.random() * length)
  return n
}

export default function LoveNotes({ notes = NOTES }: { notes?: string[] }) {
  const root = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(-1)
  const [flipped, setFlipped] = useState(false)
  const busy = useRef(false)

  // Entrance + float
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(card.current, { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' })
    }, root)
    return () => ctx.revert()
  }, [])

  const burst = () => {
    const box = root.current
    if (!box) return
    for (let i = 0; i < 12; i++) {
      const h = document.createElement('span')
      h.textContent = '♥'
      h.className = 'pointer-events-none absolute left-1/2 top-1/2 text-rose'
      box.appendChild(h)
      gsap.fromTo(
        h,
        { x: 0, y: 0, scale: 0.5, opacity: 1 },
        {
          x: gsap.utils.random(-140, 140),
          y: gsap.utils.random(-170, -40),
          scale: gsap.utils.random(0.8, 1.6),
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: () => h.remove(),
        },
      )
    }
  }

  const flipTo = (face: number) =>
    gsap.to(card.current, { rotationY: face, duration: 0.7, ease: 'power3.inOut' })

  const draw = () => {
    if (busy.current) return
    busy.current = true
    const next = pickNext(index, notes.length)

    if (!flipped) {
      setIndex(next)
      flipTo(180).then(() => {
        busy.current = false
      })
      setFlipped(true)
      burst()
    } else {
      // Flip back, swap text while face-down, flip again
      gsap.timeline({ onComplete: () => { busy.current = false } })
        .to(card.current, { rotationY: 360, duration: 0.7, ease: 'power3.inOut' })
        .call(() => {
          setIndex(next)
          gsap.set(card.current, { rotationY: 0 })
          burst()
        })
        .to(card.current, { rotationY: 180, duration: 0.7, ease: 'power3.inOut' })
    }
  }

  const reset = () => {
    if (busy.current || !flipped) return
    busy.current = true
    flipTo(0).then(() => {
      busy.current = false
    })
    setFlipped(false)
  }

  return (
    <section className="bg-blush px-6 py-32">
      <div ref={root} className="relative mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="font-serif text-5xl">Reasons I love you</h2>
        <p className="mt-4 mb-12 text-ink/80">Tap the card to read one. There are plenty more.</p>

        <div className="h-72 w-full max-w-sm" style={{ perspective: 1200 }}>
          <div
            ref={card}
            role="button"
            tabIndex={0}
            aria-label={flipped ? 'Show another reason' : 'Reveal a reason'}
            onClick={draw}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                draw()
              }
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            className="relative h-full w-full cursor-pointer select-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-ui bg-rose text-white"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="text-5xl">♥</span>
              <span className="font-serif text-2xl">Tap to open</span>
            </div>
            {/* Back */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-ui bg-petal p-8"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <p className="font-serif text-2xl leading-snug text-ink">
                {index >= 0 ? notes[index] : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-3">
          <button
            type="button"
            onClick={draw}
            className="rounded-ui bg-rose px-7 py-3 font-medium text-white transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {flipped ? 'Read another' : 'Read a note'}
          </button>
          {flipped && (
            <button
              type="button"
              onClick={reset}
              className="rounded-ui px-7 py-3 text-ink underline-offset-4 transition hover:underline"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
