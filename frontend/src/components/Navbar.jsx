import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Code2,
  CalendarDays,
  BookOpen,
  Radio,
} from 'lucide-react'

const C = {
  bg: '#090D14',
  card: '#111825',
  border: '#1e2a3a',
  cyan: '#14B8A6',
  purple: '#8B5CF6',
  fg: '#E8EAED',
  muted: '#5a6880',
}

const navItems = [
  { icon: Home,        label: 'Home',    path: '/' },
  // { icon: Code2,       label: 'Build',   path: '/build' },
  { icon: CalendarDays,label: 'Events',  path: '/events' },
  { icon: BookOpen,    label: 'Docs',    path: '/resources' },
  // { icon: Radio,       label: 'Live',    path: '/live', dividerBefore: true },
]

const terminalLines = [
  '> npm run dev',
  '> git push origin main',
  '> docker compose up',
  '> python train.py',
  '> node server.js',
  '> cargo build --release',
]

function TerminalTicker() {
  const [idx, setIdx] = useState(0)

  // use useRef so the interval callback always sees current idx
  const idxRef = useRef(0)
  useState(() => {
    const id = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % terminalLines.length
      setIdx(idxRef.current)
    }, 2200)
    return () => clearInterval(id)
  })

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '2px 0', textAlign: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          style={{
            color: C.cyan,
            fontSize: '8px',
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 6px',
          }}
        >
          {terminalLines[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Compute per-item nudge based on distance from hovered index
function getNudge(index, hoveredIndex) {
  if (hoveredIndex === null || index === hoveredIndex) return { y: 0, scale: 1, opacity: 1 }
  const diff = index - hoveredIndex
  if (Math.abs(diff) === 1) return { y: diff > 0 ? 7 : -7, scale: 0.95, opacity: 0.7 }
  if (Math.abs(diff) === 2) return { y: diff > 0 ? 3 : -3, scale: 0.97, opacity: 0.85 }
  return { y: 0, scale: 1, opacity: 1 }
}

export default function Navbar() {
  const location = useLocation()
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <nav
      style={{
        position: 'fixed',
        left: 0, top: 0,
        height: '100vh',
        width: '90px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '22px',
        paddingBottom: '20px',
        // backgroundColor: C.bg,
        // borderRight: `1px solid ${C.border}`,
        zIndex: 100,
        // boxShadow: '4px 0 32px rgba(0,0,0,0.4)',
      }}
    >

      {/* ── TOP: Logo + ticker ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            style={{ position: 'relative', width: '56px', height: '56px', cursor: 'pointer' }}
          >
            {/* Spinning ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '-3px', borderRadius: '50%',
                background: `conic-gradient(from 0deg, ${C.cyan}, ${C.purple} 50%, transparent 50%)`,
                zIndex: 0,
              }}
            />
            {/* Ring mask */}
            <div style={{
              position: 'absolute', inset: '-1px', borderRadius: '50%',
              backgroundColor: C.bg, zIndex: 1,
            }} />
            {/* Inner */}
            <div style={{
              position: 'absolute', inset: '3px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#fff',
              letterSpacing: '0.05em', zIndex: 2,
              fontFamily: '"Fira Code", monospace',
            }}>
              KP
            </div>
          </motion.div>
        </Link>

        <TerminalTicker />
      </div>

      {/* ── MIDDLE: Nav icons ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      }}>
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          const isHovered = hoveredIndex === index
          const nudge = getNudge(index, hoveredIndex)

          return (
            <div key={index}>
              {item.dividerBefore && (
                <div style={{
                  width: '36px', height: '1px',
                  background: `linear-gradient(to right, transparent, ${C.border}, transparent)`,
                  margin: '4px auto 12px',
                }} />
              )}

              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link to={item.path} style={{ textDecoration: 'none', display: 'block' }}>
                  <motion.div
                    animate={{
                      y: nudge.y,
                      scale: isHovered ? 1.3 : nudge.scale,
                      opacity: nudge.opacity,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '16px',
                      margin: '8px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: isActive || isHovered
                        ? 'rgba(20,184,166,0.08)'
                        : C.card,
                      border: isActive || isHovered
                        ? `1px solid rgba(20,184,166,0.45)`
                        : `1px solid ${C.border}`,
                      color: isActive || isHovered ? C.cyan : C.muted,
                      boxShadow: isActive || isHovered
                        ? `0 0 22px rgba(20,184,166,0.12)`
                        : `0 2px 8px rgba(0,0,0,0.25)`,
                      gap: '4px',
                      
                      
                    }}
                  >
                    {/* Left gradient pill (active / hover) */}
                    <AnimatePresence>
                      {(isActive || isHovered) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 28, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{
                            position: 'absolute', left: 0, top: '50%',
                            transform: 'translateY(-50%)',
                            width: '3px',
                            background: `linear-gradient(to bottom, ${C.cyan}, ${C.purple})`,
                            borderRadius: '0 3px 3px 0',
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Radial glow bg */}
                    <AnimatePresence>
                      {(isActive || isHovered) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: 'absolute', inset: 0,
                            background: `radial-gradient(circle at center, rgba(20,184,166,0.18), transparent 70%)`,
                            borderRadius: '16px',
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon */}
                    <motion.div
                      animate={{
                        rotate: isHovered ? [-10, 10, 0] : 0,
                        scale: isHovered ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      style={{ position: 'relative', zIndex: 1 }}
                    >
                      <Icon size={22} strokeWidth={1.8} />
                    </motion.div>

                    {/* Label slides up on hover */}
                    <motion.span
                      animate={{
                        opacity: isHovered || isActive ? 1 : 0,
                        y: isHovered || isActive ? 0 : 4,
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'relative', zIndex: 1,
                        fontSize: '7.5px', fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: '"Fira Code", monospace',
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                </Link>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -16, scale: 0.93 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -6, scale: 0.93 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        left: 'calc(100% + 14px)',
                        top: '50%',
                        transform: 'translateY(-80%)',
                        backgroundColor: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: '9px',
                        padding: '7px 13px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 200,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
                      }}
                    >
                      <span style={{
                        color: C.fg, fontSize: '12px', fontWeight: 500,
                        fontFamily: '"Fira Code", monospace',
                      }}>
                        <span style={{ color: C.cyan }}>/</span>
                        {item.label.toLowerCase()}
                      </span>
                      {/* Arrow */}
                      <div style={{
                        position: 'absolute', left: '-5px', top: '50%',
                        transform: 'translateY(-50%) rotate(45deg)',
                        width: '8px', height: '8px',
                        backgroundColor: C.card,
                        border: `1px solid ${C.border}`,
                        borderRight: 'none', borderTop: 'none',
                      }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── BOTTOM: Pulse + brand ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.cyan }}
          />
          <span style={{
            color: C.muted, fontSize: '8px',
            fontFamily: '"Fira Code", monospace', letterSpacing: '0.06em',
          }}>
            live
          </span>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} style={{ textAlign: 'center', cursor: 'default' }}>
          <span style={{
            color: C.fg, fontSize: '8px', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            lineHeight: 1.6, display: 'block',
            fontFamily: '"Fira Code", monospace',
          }}>
            KP<br />DEV<br />CELL
          </span>
        </motion.div>
      </div>

    </nav>
  )
}