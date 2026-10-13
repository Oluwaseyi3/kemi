import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import photo from '../assets/1.jpeg'

const MESSAGE = 'Loading our story...'

type LoaderProps = {
  /** Called once the curtain has fully lifted; unmount the loader here. */
  onDone: () => void
}

export default function Loader({ onDone }: LoaderProps) {
  const root = useRef<HTMLDivElement>(null)
  const heart = useRef<SVGSVGElement>(null)
  const text = useRef<HTMLParagraphElement>(null)
  const left = useRef<HTMLDivElement>(null)
  const right = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  // Keep the latest callback without re-running the timeline
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const chars = { n: 0 }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => doneRef.current() })

      if (reduce) {
        tl.to(root.current, { autoAlpha: 0, duration: 0.4 })
        return
      }

      // Heart fades in, then beats forever until the timeline moves on
      gsap.set(text.current, { textContent: '' })
      tl.from(heart.current, { opacity: 0, duration: 0.8, ease: 'power2.out' })
      tl.to(
        heart.current,
        { scale: 1.12, duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 5 },
        '<0.3',
      )
      // Typewriter
      tl.to(
        chars,
        {
          n: MESSAGE.length,
          duration: 1.8,
          ease: 'none',
          onUpdate: () => {
            if (text.current) text.current.textContent = MESSAGE.slice(0, Math.round(chars.n))
          },
        },
        0.6,
      )
      // Content leaves, curtains part
      tl.to(content.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' }, '+=0.3')
      tl.to(left.current, { xPercent: -100, duration: 1.2, ease: 'power4.inOut' }, '>-0.1')
      tl.to(right.current, { xPercent: 100, duration: 1.2, ease: 'power4.inOut' }, '<')
      tl.set(root.current, { display: 'none' })
    }, root)

    // Reverts all tweens and timelines created in the context
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      role="status"
      aria-label="Loading"
    >
      {/* Two halves of the same photo; they meet seamlessly, then part like a curtain */}
      <div ref={left} className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-blush">
        <img src={photo} alt="" className="absolute inset-y-0 left-0 h-full w-screen max-w-none object-cover object-[50%_25%]" />
      </div>
      <div ref={right} className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-blush">
        <img src={photo} alt="" className="absolute inset-y-0 right-0 h-full w-screen max-w-none object-cover object-[50%_25%]" />
      </div>
      <div className="absolute inset-0 bg-ink/45" />

      <div ref={content} className="relative mt-[60vh] flex flex-col items-center gap-5">
        <svg
          ref={heart}
          viewBox="0 0 24 24"
          className="h-14 w-14 text-blush"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2 0 3.4 1.1 4.2 2.4h3.6C14.6 6.1 16 5 18 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" />
        </svg>
        <p
          ref={text}
          className="min-h-8 font-serif text-2xl text-white"
        />
      </div>
    </div>
  )
}
