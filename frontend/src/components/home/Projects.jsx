import { motion } from 'framer-motion'
import { C } from '../../constants/theme'
import { Section, SectionLabel, SectionTitle } from '../shared'

// ── Project card ──────────────────────────────────────────────
function ProjectCard({ title, description, stack, github, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ borderColor: 'rgba(139,92,246,0.4)', y: -4 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Ambient purple glow top-right */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        background: `radial-gradient(circle at top right, rgba(139,92,246,0.15), transparent)`,
        pointerEvents: 'none',
      }} />

      <div style={{ fontWeight: 700, color: C.fg, fontSize: '18px', marginBottom: '10px' }}>
        {title}
      </div>
      <div style={{ color: C.muted, fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>
        {description}
      </div>

      {/* Stack badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {stack.map(s => (
          <span key={s} style={{
            backgroundColor: 'rgba(20,184,166,0.08)',
            border: `1px solid rgba(20,184,166,0.2)`,
            color: C.cyan, fontSize: '11px',
            padding: '3px 10px', borderRadius: '20px',
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
          }}>
            {s}
          </span>
        ))}
      </div>

      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: C.purple, fontSize: '12px', textDecoration: 'none',
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.target.style.opacity = '0.7')}
          onMouseLeave={e => (e.target.style.opacity = '1')}
        >
          view on github ↗
        </a>
      )}
    </motion.div>
  )
}

// ── Data ─────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: 'KP Dev Cell Website',
    description:
      'Official club website built with React, Express, MongoDB and Firebase. Features an admin dashboard, event management, and member access control.',
    stack: ['React', 'Express', 'MongoDB', 'Firebase', 'Docker'],
    github: '#',
  },
  {
    title: 'Project Two',
    description:
      'Describe your second project here. What problem did it solve? What did you learn building it?',
    stack: ['Python', 'FastAPI', 'PostgreSQL'],
    github: '#',
  },
  {
    title: 'Project Three',
    description:
      'Describe your third project here. Keep it honest and technical — judges and visitors appreciate real details.',
    stack: ['Node.js', 'React', 'Redis'],
    github: '#',
  },
]

// ── Component ─────────────────────────────────────────────────
export default function Projects() {
  return (
    <div style={{
      backgroundColor: 'rgba(22,27,38,0.4)',
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
    }}>
      <Section>
        <SectionLabel>Projects</SectionLabel>
        <SectionTitle>Things we've shipped.</SectionTitle>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={i} {...p} delay={i * 0.1} />
          ))}
        </div>
      </Section>
    </div>
  )
}
