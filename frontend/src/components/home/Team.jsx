import { motion } from 'framer-motion'
import { C } from '../../constants/theme'
import { Section, SectionLabel, SectionTitle } from '../shared'

// ── Team card ─────────────────────────────────────────────────
function TeamCard({ name, role, batch, github, delay }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, borderColor: 'rgba(20,184,166,0.35)' }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200 }}
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '24px',
        cursor: 'default',
        // transition only for border-color; motion handles y
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '52px', height: '52px', borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', fontWeight: 800, color: '#fff',
        marginBottom: '14px',
        userSelect: 'none',
      }}>
        {initials}
      </div>

      <div style={{ fontWeight: 700, color: C.fg, fontSize: '15px', marginBottom: '4px' }}>
        {name}
      </div>
      <div style={{
        color: C.cyan, fontSize: '12px',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        marginBottom: '4px',
      }}>
        {role}
      </div>
      <div style={{ color: C.muted, fontSize: '11px' }}>Batch {batch}</div>

      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block', marginTop: '12px',
            color: C.muted, fontSize: '11px', textDecoration: 'none',
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.target.style.color = C.cyan)}
          onMouseLeave={e => (e.target.style.color = C.muted)}
        >
          github ↗
        </a>
      )}
    </motion.div>
  )
}

// ── Data ─────────────────────────────────────────────────────
const TEAM = [
  { name: 'Your Name',    role: 'Overall Coordinator', batch: '2023', github: '#' },
  { name: 'Member Two',   role: 'Tech Lead',           batch: '2023', github: '#' },
  { name: 'Member Three', role: 'Web Dev Head',         batch: '2024', github: '#' },
  { name: 'Member Four',  role: 'Design Head',          batch: '2024', github: '#' },
  { name: 'Member Five',  role: 'Core Member',          batch: '2025', github: '#' },
  { name: 'Member Six',   role: 'Core Member',          batch: '2025', github: '#' },
]

// ── Component ─────────────────────────────────────────────────
export default function Team() {
  return (
    <Section>
      <SectionLabel>Core team</SectionLabel>
      <SectionTitle>The people who make it run.</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        {TEAM.map((member, i) => (
          <TeamCard key={i} {...member} delay={i * 0.08} />
        ))}
      </div>
    </Section>
  )
}
