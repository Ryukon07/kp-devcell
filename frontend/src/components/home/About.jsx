import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { C } from '../../constants/theme'
import { Section, SectionLabel, TechBadge } from '../shared'
import { ScrambleText } from '../../hooks/useScramble.jsx'

// ── Scrambled stat counter ────────────────────────────────────
// The number itself counts up driven by scroll, with random digit
// flicker before it resolves to the real value.
function ScrambleStatCard({ value, label, suffix = '+', sectionRef, scrollStart, scrollEnd }) {
  const [displayVal, setDisplayVal] = useState('--')
  const [locked, setLocked]         = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 90%', 'end 60%'],
  })

  const progress = useTransform(scrollYProgress, [scrollStart, scrollEnd], [0, 1])

  useMotionValueEvent(progress, 'change', (p) => {
    if (p <= 0) {
      setDisplayVal('--')
      setLocked(false)
      return
    }
    if (p >= 1) {
      setDisplayVal(String(value))
      setLocked(true)
      return
    }
    // During scramble: show random digits
    setLocked(false)
    const digits = String(value).length
    setDisplayVal(
      Array(digits).fill(0).map(() => Math.floor(Math.random() * 10)).join('')
    )
  })

  // Flicker loop while not locked
  useEffect(() => {
    if (locked) return
    const id = setInterval(() => {
      const p = progress.get()
      if (p <= 0 || p >= 1) return
      const digits = String(value).length
      // Partially reveal: left chars resolve based on progress
      const resolvedDigits = Math.floor(p * digits)
      const real = String(value).padStart(digits, '0')
      setDisplayVal(
        real.split('').map((d, i) =>
          i < resolvedDigits ? d : String(Math.floor(Math.random() * 10))
        ).join('')
      )
    }, 60)
    return () => clearInterval(id)
  }, [locked, value, progress])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '28px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`,
      }} />
      <div style={{
        fontSize: '42px', fontWeight: 800,
        color: locked ? C.cyan : 'rgba(20,184,166,0.5)',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        letterSpacing: '-0.02em',
        transition: 'color 0.3s ease',
      }}>
        {displayVal}{locked ? suffix : ''}
      </div>
      <div style={{
        color: C.muted, fontSize: '13px', marginTop: '6px',
        letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </motion.div>
  )
}

// ── Scrambled section heading ─────────────────────────────────
// Splits the heading into lines so line breaks are preserved exactly.
function ScrambleHeading({ lines, sectionRef }) {
  // Stagger each line's reveal window
  const lineOffsets = lines.map((_, i) => ({
    start: i * 0.08,
    end:   i * 0.08 + 0.35,
  }))

  return (
    <h2 style={{
      fontSize: 'clamp(28px, 4vw, 44px)',
      fontWeight: 800,
      color: C.fg,
      margin: '0 0 48px 0',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    }}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block' }}>
          <ScrambleText
            text={line}
            sectionRef={sectionRef}
            startOffset={lineOffsets[i].start}
            endOffset={lineOffsets[i].end}
            resolvedColor={C.fg}
            scrambleColor="rgba(20,184,166,0.3)"
          />
        </span>
      ))}
    </h2>
  )
}

// ── Scrambled paragraph ───────────────────────────────────────
function ScrambleParagraph({ text, sectionRef, startOffset, endOffset, style = {} }) {
  return (
    <p style={{ color: C.muted, fontSize: '15px', lineHeight: 1.8, ...style }}>
      <ScrambleText
        text={text}
        sectionRef={sectionRef}
        startOffset={startOffset}
        endOffset={endOffset}
        resolvedColor={C.muted}
        scrambleColor="rgba(126,133,144,0.3)"
      />
    </p>
  )
}

// ── Data ─────────────────────────────────────────────────────
const TECH_STACK = [
  'React', 'Node.js', 'Python', 'FastAPI', 'MongoDB',
  'Docker', 'Git', 'Linux', 'TypeScript', 'REST APIs',
  'PostgreSQL', 'Redis', 'AWS', 'CI/CD', 'Open Source',
]

const PARA_1 = "KP Dev Cell is IIT Mandi's development club. We exist to bridge the gap between curriculum and industry — through real projects, honest feedback, and a culture of building things that actually work."
const PARA_2 = "No gatekeeping. No prerequisites. If you're curious and willing to put in the work — you belong here."

// ── Component ─────────────────────────────────────────────────
export default function About() {
  const sectionRef = useRef(null)

  return (
    <>
      {/* ── About ── */}
      <div ref={sectionRef}>
        <Section>
          <SectionLabel>About</SectionLabel>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '64px',
            alignItems: 'start',
          }}>

            {/* Left: scrambled text */}
            <div>
              <ScrambleHeading
                lines={['A club built by builders,', 'for builders.']}
                sectionRef={sectionRef}
              />
              <ScrambleParagraph
                text={PARA_1}
                sectionRef={sectionRef}
                startOffset={0.15}
                endOffset={0.55}
                style={{ margin: '0 0 20px 0' }}
              />
              <ScrambleParagraph
                text={PARA_2}
                sectionRef={sectionRef}
                startOffset={0.3}
                endOffset={0.65}
                style={{ margin: 0 }}
              />
            </div>

            {/* Right: scrambled stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <ScrambleStatCard
                value={50}  label="Members"          suffix="+"
                sectionRef={sectionRef} scrollStart={0.1} scrollEnd={0.45}
              />
              <ScrambleStatCard
                value={12}  label="Projects built"   suffix="+"
                sectionRef={sectionRef} scrollStart={0.2} scrollEnd={0.5}
              />
              <ScrambleStatCard
                value={20}  label="Sessions held"    suffix="+"
                sectionRef={sectionRef} scrollStart={0.3} scrollEnd={0.55}
              />
              <ScrambleStatCard
                value={3}   label="Semesters active" suffix=""
                sectionRef={sectionRef} scrollStart={0.4} scrollEnd={0.6}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* ── Tech stack ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <Section style={{ padding: '64px 48px' }}>
          <SectionLabel>What we work with</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {TECH_STACK.map((tech, i) => (
              <TechBadge key={tech} name={tech} delay={i * 0.04} />
            ))}
          </div>
        </Section>
      </div>
    </>
  )
}