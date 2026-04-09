import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { C } from '../../constants/theme'
import MatrixRain from './MatrixRain'

// ── Typewriter hook ───────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [wordIdx, setWordIdx]     = useState(0)
  const [charIdx, setCharIdx]     = useState(0)
  const [deleting, setDeleting]   = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIdx(c => c + 1)
        }
      } else {
        setDisplayed(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx(i => (i + 1) % words.length)
          setCharIdx(0)
        } else {
          setCharIdx(c => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return displayed
}

// ── Floating code snippet ─────────────────────────────────────
function CodeSnippet({ code }) {
  const lines = code.split('\n')
  return (
    <div style={{
      backgroundColor: 'rgba(22,27,38,0.88)',
      border: `1px solid ${C.border}`,
      borderRadius: '10px',
      padding: '12px 16px',
      fontFamily: '"Fira Code", "Cascadia Code", monospace',
      fontSize: '11px',
      lineHeight: 1.7,
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      maxWidth: '220px',
    }}>
      <pre style={{ margin: 0 }}>
        {lines.map((line, i) => {
          let color = C.fg
          if (line.includes('//')) color = '#4B5563'
          else if (line.includes('"') || line.includes("'")) color = '#10B981'
          else if (/\b(const|function|return|import)\b/.test(line)) color = C.purple
          else if (/[=>{}\[\]]/.test(line)) color = C.cyan
          return <div key={i} style={{ color }}>{line}</div>
        })}
      </pre>
    </div>
  )
}

// ── Data ─────────────────────────────────────────────────────
const TYPEWRITER_WORDS = [
  'Build. Break. Learn.',
  'Ship Real Projects.',
  'Write Clean Code.',
  'Learn Together.',
  'Go Beyond Curriculum.',
]

const FLOATING_SNIPPETS = [
  {
    code: `// KP Dev Cell\nconst club = {\n  mission: 'build',\n  vibe: 'learn',\n}`,
    pos: { top: '18%', right: '6%' },
  },
  {
    code: `function joinClub() {\n  return skills++\n    && network++\n    && fun++\n}`,
    pos: { top: '55%', right: '3%' },
  },
]

// ── Component ─────────────────────────────────────────────────
export default function Hero() {
  const typed    = useTypewriter(TYPEWRITER_WORDS)
  const heroRef  = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY       = useTransform(scrollYProgress, [0, 1],   ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

    <motion.section
      ref={heroRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        // overflow:hidden keeps the absolute canvas clipped to this section
        overflow: 'hidden',
        y: heroY,
        opacity: heroOpacity,
      }}
    >
      {/* Matrix rain — clipped inside this section, never bleeds below */}
      <MatrixRain heroRef={heroRef} />

      {/* Ambient orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '30%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '20%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Floating code snippets */}
      {FLOATING_SNIPPETS.map((s, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
          style={{ position: 'absolute', zIndex: 3, ...s.pos }}
        >
          <CodeSnippet code={s.code} />
        </motion.div>
      ))}

      {/* Main content */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '0 48px', position: 'relative', zIndex: 2,
      }}>

        {/* Club label pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(20,184,166,0.08)',
            border: '1px solid rgba(20,184,166,0.25)',
            borderRadius: '20px', padding: '6px 14px',
            marginBottom: '32px',
          }}
        >
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: C.cyan, display: 'inline-block',
          }} />
          <span style={{
            color: C.cyan, fontSize: '12px', fontWeight: 500,
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
          }}>
            Kammand Prompt Club — IIT Mandi
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontSize: 'clamp(42px, 7vw, 88px)',
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: '-0.04em',
            margin: '0 0 24px 0', maxWidth: '700px',
          }}
        >
          <span style={{ color: C.fg }}>We don't</span>
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            just code.
          </span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            fontSize: 'clamp(16px, 2.5vw, 24px)',
            color: C.muted,
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            marginBottom: '40px', height: '36px',
            display: 'flex', alignItems: 'center', gap: '2px',
          }}
        >
          <span style={{ color: C.cyan }}>$ </span>
          <span>{typed}</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ color: C.cyan, fontWeight: 300 }}
          >|</motion.span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
        >
          <motion.a
            href="/events"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: `linear-gradient(135deg, ${C.cyan}, #0e9488)`,
              color: '#fff', padding: '14px 28px', borderRadius: '10px',
              textDecoration: 'none', fontWeight: 700, fontSize: '14px',
              boxShadow: '0 0 32px rgba(20,184,166,0.25)',
              display: 'inline-block',
            }}
          >
            See upcoming events →
          </motion.a>
          <motion.a
            href="/resources"
            whileHover={{ scale: 1.04, borderColor: C.cyan, color: C.cyan }}
            whileTap={{ scale: 0.97 }}
            style={{
              border: `1px solid ${C.border}`,
              color: C.muted, padding: '14px 28px', borderRadius: '10px',
              textDecoration: 'none', fontWeight: 600, fontSize: '14px',
              transition: 'all 0.2s ease', display: 'inline-block',
            }}
          >
            Browse resources
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute', bottom: '40px', left: '50%',
          transform: 'translateX(-50%)',
          color: C.muted, fontSize: '12px',
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          zIndex: 2,
        }}
      >
        <span>scroll</span>
        <div style={{ width: '1px', height: '32px', backgroundColor: C.border }} />
      </motion.div>
    </motion.section>
    </div>
  )
}