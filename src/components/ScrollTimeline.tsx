import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import photo2 from '../assets/2.jpeg'
import photo3 from '../assets/3.jpeg'
import video4 from '../assets/4.mp4'
import video5 from '../assets/5.mov'

gsap.registerPlugin(ScrollTrigger)

type Milestone = {
  title: string
  text: string
  image?: string
  video?: string
}

const MILESTONES: Milestone[] = [
  {
    title: 'You are my queen',
    text: 'From the moment you walked into my life, I knew I was in the presence of royalty. You carry yourself like a queen, and I would happily spend forever serving the one who rules my heart.',
    video: video4,
  },
  {
    title: 'My princess, my baby',
    text: 'You are my princess, and you are my absolute baby. Soft, strong, and mine to cherish. Every day I want to take care of you, make you laugh, and remind you how deeply you are loved.',
    image: photo2,
  },
  {
    title: 'My honeypot',
    text: 'You are like a honeypot filled with every sweet thing I could ever dream of. Your laugh, your warmth, your touch. I could never get enough, and I never want to.',
    image: photo3,
  },
  {
    title: 'My forever sweet tooth',
    text: 'I cannot take my eyes, or my lips, off you, because you are my forever sweet tooth. I love you so much more than words could ever describe, and I will keep trying to show you anyway.',
    video: video5,
  },
]

const MEDIA = 'mt-5 aspect-[4/5] w-full rounded-ui object-cover object-[50%_35%]'

export default function ScrollTimeline({ milestones = MILESTONES }: { milestones?: Milestone[] }) {
  const root = useRef<HTMLElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const items = useRef<HTMLLIElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The line draws as you scroll through the section
        gsap.fromTo(
          line.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom 70%', scrub: true },
          },
        )

        // Each memory rises into place once
        const wide = window.matchMedia('(min-width: 1024px)').matches
        items.current.forEach((item, i) => {
          gsap.from(item.querySelector('[data-card]'), {
            opacity: 0,
            x: wide ? (i % 2 === 0 ? -50 : 50) : 0,
            y: 40,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
          })
        })
      })
    }, root)

    // Kills every ScrollTrigger / tween / matchMedia created inside the context
    return () => ctx.revert()
  }, [milestones])

  return (
    <section ref={root} className="bg-petal px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-20 max-w-xl lg:text-center">
          <h2 className="font-serif text-5xl leading-tight md:text-6xl">Everything you are to me</h2>
          <p className="mt-5 text-ink/80">Four ways you are my whole world.</p>
        </div>

        <div className="relative pl-10 lg:pl-0">
          <div ref={line} className="absolute left-3 top-0 h-full w-px bg-rose lg:left-1/2" />
          <ol className="space-y-20">
            {milestones.map((m, i) => (
              <li
                key={m.title}
                ref={(el) => {
                  if (el) items.current[i] = el
                }}
                className="relative lg:grid lg:grid-cols-2"
              >
                <span className="absolute -left-[34px] top-6 h-3 w-3 rounded-full bg-rose ring-4 ring-petal lg:left-1/2 lg:-translate-x-1/2" />
                <article
                  data-card
                  className={`rounded-ui bg-blush p-8 ${i % 2 === 0 ? 'lg:col-start-1 lg:mr-14' : 'lg:col-start-2 lg:ml-14'}`}
                >
                  <h3 className="font-serif text-3xl">{m.title}</h3>
                  {m.video && <video src={m.video} autoPlay loop muted playsInline className={MEDIA} />}
                  {m.image && <img src={m.image} alt="" className={MEDIA} />}
                  <p className="mt-5 text-ink/85">{m.text}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
