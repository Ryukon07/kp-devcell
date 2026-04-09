import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { C } from '../../constants/theme'
import MatrixRain from './MatrixRain'
import api from '../../api.js'

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

// ── Typewriter for expanding message ─────────────────────────
function useMessageTypewriter(text, active, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone]           = useState(false)
  const idxRef = useRef(0)

  useEffect(() => {
    if (!active) {
      setDisplayed('')
      setDone(false)
      idxRef.current = 0
      return
    }
    idxRef.current = 0
    setDisplayed('')
    setDone(false)

    const interval = setInterval(() => {
      idxRef.current += 1
      setDisplayed(text.slice(0, idxRef.current))
      if (idxRef.current >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [active, text, speed])

  return { displayed, done }
}

// ── Floating Announcement Card ────────────────────────────────
function AnnouncementCard({ announcement, floatDelay }) {
  const [expanded, setExpanded] = useState(false)

  const date = new Date(announcement.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  const { displayed, done } = useMessageTypewriter(
    announcement.message,
    expanded,
    16
  )

  return (
    <motion.div
      layout
      onClick={() => setExpanded(e => !e)}
      // animate={{ y: expanded ? 0 : [0, -12, 0] }}
      // transition={
      //   expanded
      //     ? { layout: { duration: 0.35, ease: 'easeInOut' } }
      //     : { duration: 4 + floatDelay, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }
      // }
      style={{
        backgroundColor: 'rgba(22,27,38,0.92)',
        border: `1px solid ${expanded ? 'rgba(20,184,166,0.35)' : C.border}`,
        borderRadius: '12px',
        padding: '16px 20px',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        fontSize: '13px',
        lineHeight: 1.7,
        backdropFilter: 'blur(14px)',
        boxShadow: expanded
          ? `0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(20,184,166,0.1)`
          : '0 8px 32px rgba(0,0,0,0.4)',
        width: '280px',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        position: 'relative',
      }}
    >
      {/* Top row: dot + label + date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {/* Pulsing dot */}
          <motion.span
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '5px', height: '5px', borderRadius: '50%',
              backgroundColor: C.cyan, display: 'inline-block', flexShrink: 0,
            }}
          />
          <span style={{
            color: C.cyan, fontSize: '10px',
            letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
          }}>
            announcement
          </span>
        </div>
        <span style={{ color: '#4B5563', fontSize: '10px' }}>{date}</span>
      </div>

      {/* Title */}
      <div style={{
        color: C.fg, fontWeight: 600, fontSize: '11px',
        lineHeight: 1.4, marginBottom: '5px',
      }}>
        {announcement.title}
      </div>

      {/* Message — collapsed: 2 lines truncated | expanded: typewriter */}
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="preview"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              color: '#6B7280', fontSize: '12px', lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {announcement.message}
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: '#9CA3AF', fontSize: '12px', lineHeight: 1.6,
            }}
          >
            {displayed}
            {/* blinking cursor while typing */}
            {!done && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{ color: C.cyan, fontWeight: 300 }}
              >|</motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint text */}
      <div style={{
        marginTop: '8px',
        fontSize: '10px',
        color: expanded ? 'rgba(20,184,166,0.5)' : '#374151',
        letterSpacing: '0.08em',
        textAlign: 'right',
        transition: 'color 0.2s ease',
      }}>
        {expanded ? '[ click to collapse ]' : '[ click to expand ]'}
      </div>
    </motion.div>
  )
}

// ── Positions for up to 3 announcement cards ──────────────────
const CARD_POSITIONS_POOL = [
  { top: '16%', left: '4%' },
  { top: '22%', right: '4%' },
  { top: '44%', left: '7%' },
  { top: '52%', right: '6%' },
  { bottom: '14%', left: '6%' },
  { bottom: '10%', right: '8%' },
]

function shufflePositions(positions) {
  const shuffled = [...positions]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ── Data ─────────────────────────────────────────────────────
const TYPEWRITER_WORDS = [
  'Build. Break. Learn.',
  'Ship Real Projects.',
  'Write Clean Code.',
  'Learn Together.',
  'Go Beyond Curriculum.',
]

// ── Component ─────────────────────────────────────────────────
export default function Hero() {
  const typed   = useTypewriter(TYPEWRITER_WORDS)
  const heroRef = useRef(null)
  const [announcements, setAnnouncements] = useState([])
  const [cardPositions] = useState(() => shufflePositions(CARD_POSITIONS_POOL))

  // Fetch only active announcements, max 3
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements')
        // filter active only, take up to 3
        const active = res.data.filter(a => a.active !== false).slice(0, 3)
        setAnnouncements(active)
      } catch (err) {
        console.error('Failed to fetch announcements')
      }
    }
    fetchAnnouncements()
  }, [])

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
          overflow: 'hidden',
          y: heroY,
          opacity: heroOpacity,
        }}
      >
        {/* Matrix rain */}
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

        {/* Floating announcement cards */}
        {announcements.map((announcement, i) => (
          <div
            key={announcement._id}
            style={{
              position: 'absolute',
              zIndex: 3,
              ...cardPositions[i % cardPositions.length],
            }}
          >
            <AnnouncementCard
              announcement={announcement}
              floatDelay={i * 1.5}
            />
          </div>
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
                display: 'inline-flex', alignItems: 'center', gap: '10px',
              backgroundColor: 'rgba(20,184,166,0.08)',
              border: '1px solid rgba(20,184,166,0.25)',
                borderRadius: '20px', padding: '8px 18px',
                marginBottom: '36px',
            }}
          >
            <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: C.cyan, display: 'inline-block',
            }} />
            <span style={{
                color: C.cyan, fontSize: '14px', fontWeight: 500,
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
              fontSize: 'clamp(52px, 8vw, 108px)',
              fontWeight: 900, lineHeight: 1.05,
              letterSpacing: '-0.04em',
              margin: '0 0 28px 0', maxWidth: '760px',
            }}
          >
            <span style={{ color: C.fg }}>We don't</span>
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Fuck OFF.
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontSize: 'clamp(20px, 3vw, 30px)',
              color: C.muted,
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              marginBottom: '48px', height: '44px',
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
            style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}
          >
            <motion.a
              href="/events"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: `linear-gradient(135deg, ${C.cyan}, #0e9488)`,
                color: '#fff', padding: '16px 32px', borderRadius: '12px',
                textDecoration: 'none', fontWeight: 700, fontSize: '16px',
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
                color: C.muted, padding: '16px 32px', borderRadius: '12px',
                textDecoration: 'none', fontWeight: 600, fontSize: '16px',
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
            color: C.muted, fontSize: '14px',
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