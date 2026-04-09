"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

// ── Theme constants ─────────────────────────────────────────────
const C = {
  bg: '#0d1117',
  card: '#161b22',
  border: '#30363d',
  fg: '#e6edf3',
  muted: '#7d8590',
  cyan: '#14b8a6',
  purple: '#a855f7',
  green: '#22c55e',
  pink: '#ec4899',
}

// ── Terminal-style Team Card ─────────────────────────────────────
function TeamCard({ name, role, year, stack, highlight, github, linkedin, emoji }) {
  return (
    <div
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        padding: '0',
        width: '320px',
        fontFamily: '"Fira Code", "Cascadia Code", "SF Mono", monospace',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Window Title Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: 'rgba(13, 17, 23, 0.8)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
        </div>
        <div style={{ color: C.muted, fontSize: '12px' }}>
          devcell ~ inspect_member.sh
        </div>
        <div style={{ color: C.muted, fontSize: '14px' }}>×</div>
      </div>

      {/* Terminal Content */}
      <div style={{ padding: '20px' }}>
        {/* Emoji Avatar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '48px' }}>{emoji || '👩‍💻'}</div>
        </div>

        {/* Command */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: C.muted }}>$ </span>
          <span style={{ color: C.fg }}>cat member.json</span>
        </div>

        {/* Data Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <span style={{ color: C.muted }}>name : </span>
            <span style={{ color: C.fg, fontWeight: 600 }}>{name}</span>
          </div>
          <div>
            <span style={{ color: C.muted }}>role : </span>
            <span style={{ color: C.pink }}>{role}</span>
          </div>
          <div>
            <span style={{ color: C.muted }}>year : </span>
            <span style={{ color: C.cyan }}>{year}</span>
          </div>
          <div>
            <span style={{ color: C.muted }}>stack : </span>
            <span style={{ color: C.cyan }}>{stack}</span>
          </div>
          <div>
            <span style={{ color: C.muted }}>highlight : </span>
            <span style={{ color: C.green }}>{highlight}</span>
          </div>
        </div>

        {/* Terminal Prompt */}
        <div style={{ marginTop: '16px' }}>
          <span style={{ color: C.muted }}>$ </span>
          <span style={{ color: C.muted }}>_</span>
        </div>
        <div style={{ marginTop: '4px' }}>
          <span style={{ color: C.green }}>&gt;</span>
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '16px',
              backgroundColor: C.cyan,
              marginLeft: '8px',
              animation: 'blink 1s infinite',
            }}
          />
        </div>

        {/* Social Links */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'transparent',
                border: `1px solid ${C.cyan}`,
                borderRadius: '8px',
                color: C.cyan,
                fontSize: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.cyan
                e.currentTarget.style.color = C.bg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = C.cyan
              }}
            >
              <span style={{ fontWeight: 700 }}>GH</span> GitHub
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'transparent',
                border: `1px solid ${C.cyan}`,
                borderRadius: '8px',
                color: C.cyan,
                fontSize: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.cyan
                e.currentTarget.style.color = C.bg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = C.cyan
              }}
            >
              <span style={{ fontWeight: 700 }}>LI</span> LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Team Data ─────────────────────────────────────────────────────
const TEAM = [
  {
    name: 'Ananya Sharma',
    role: 'Lead · Full Stack',
    year: 'B.Tech 3rd Year',
    stack: 'React · Node.js · PostgreSQL',
    highlight: 'Built campus nav app from scratch',
    github: '#',
    linkedin: '#',
    emoji: '👩‍💻',
  },
  {
    name: 'Rahul Verma',
    role: 'Backend Lead',
    year: 'B.Tech 3rd Year',
    stack: 'Python · Django · MongoDB',
    highlight: 'Scaled API to 10k users',
    github: '#',
    linkedin: '#',
    emoji: '👨‍💻',
  },
  {
    name: 'Priya Singh',
    role: 'Frontend Dev',
    year: 'B.Tech 2nd Year',
    stack: 'React · TypeScript · Tailwind',
    highlight: 'Created design system',
    github: '#',
    linkedin: '#',
    emoji: '👩‍🎨',
  },
  {
    name: 'Arjun Patel',
    role: 'DevOps Lead',
    year: 'B.Tech 4th Year',
    stack: 'Docker · K8s · AWS',
    highlight: 'Set up CI/CD pipeline',
    github: '#',
    linkedin: '#',
    emoji: '🧑‍💻',
  },
  {
    name: 'Sneha Gupta',
    role: 'ML Engineer',
    year: 'B.Tech 3rd Year',
    stack: 'Python · TensorFlow · PyTorch',
    highlight: 'Built recommendation engine',
    github: '#',
    linkedin: '#',
    emoji: '👩‍🔬',
  },
]

// ── Stacked Cards Component ─────────────────────────────────────
export default function Team() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Calculate positions for each card
  const getCardStyle = (index) => {
    const totalCards = TEAM.length
    const centerIndex = Math.floor(totalCards / 2)
    
    if (hoveredIndex === null) {
      // Scattered layout covering ~70% width with vertical variation
      const spacing = 140 // Wider spacing between cards
      const offsetFromCenter = (index - centerIndex) * spacing
      
      // Vertical offset creates a wave-like pattern
      const verticalOffsets = {
        0: -20,
        1: 10,
        2: -15,
        3: 25,
        4: -10,
        5: 15,
      }
      const verticalOffset = verticalOffsets[index] || 0
      
      // Varied rotations for natural scattered look (reduced tilt)
      const rotations = {
        0: -4,
        1: 6,
        2: -3,
        3: 7,
        4: -5,
        5: 4,
      }
      const rotation = rotations[index] || 0
      
      return {
        x: offsetFromCenter,
        y: verticalOffset,
        rotate: rotation,
        scale: 1,
        zIndex: index,
      }
    }
    
    if (hoveredIndex === index) {
      // Hovered card - comes to front and centers
      const centerOffset = (index - centerIndex) * 140
      return {
        x: centerOffset,
        y: 0,
        rotate: 0,
        scale: 1.05,
        zIndex: totalCards + 1,
      }
    }
    
    // Non-hovered cards - subtle separation left or right
    const direction = index < hoveredIndex ? -1 : 1
    const distance = Math.abs(index - hoveredIndex)
    const basePosition = (index - centerIndex) * 140
    
    return {
      x: basePosition + direction * (50 + distance * 20),
      y: direction * (10 + distance * 5),
      rotate: direction * (3 + distance * 1.5),
      scale: 0.96,
      zIndex: totalCards - distance,
    }
  }

  return (
    <section
      style={{
        backgroundColor: C.bg,
        minHeight: '85vh',
        padding: '60px 20px 0px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          marginBottom: '60px',
          marginLeft: '200px',
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            // marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '1px',
              backgroundColor: C.cyan,
            }}
          />
          <div
            style={{
              color: C.cyan,
              fontSize: '12px',
              fontFamily: '"Fira Code", monospace',
              letterSpacing: '2px',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Core Team
          </div>
        </div>
      </div>

      {/* Stacked Cards Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '550px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px',
        }}
      >
        {TEAM.map((member, index) => {
          const style = getCardStyle(index)
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: 1,
                y: 0,
                x: style.x,
                rotate: style.rotate,
                scale: style.scale,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                mass: 0.8,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'absolute',
                cursor: 'pointer',
                zIndex: style.zIndex,
              }}
            >
              <TeamCard {...member} />
            </motion.div>
          )
        })}
      </div>

      {/* Blinking cursor animation */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 1; }
        }
      `}</style>
    </section>
  )
}
