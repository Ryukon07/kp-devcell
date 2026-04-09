import { C } from '../constants/theme'
import Hero           from '../components/home/Hero'
import About          from '../components/home/About'
import Team           from '../components/home/Team'
import Projects       from '../components/home/Projects'
import Footer         from '../components/home/Footer'
import { Ticker }     from '../components/shared'
import CustomScrollbar from '../components/CustomScrollbar'

const TICKER_ITEMS = [
  'Web Development', 'System Design', 'Open Source', 'Hackathons',
  'DSA Sessions', 'DevOps', 'AI/ML', 'Peer Learning',
  'Code Reviews', 'Project Building',
]

export default function HomePage() {
  return (
    <div style={{
      backgroundColor: C.bg,
      minHeight: '100vh',
      fontFamily: '"Inter", system-ui, sans-serif',
      overflowX: 'hidden',
    }}>
      <CustomScrollbar />
      <Hero />
      <Ticker items={TICKER_ITEMS} />
      <About />
      <Team />
      <Projects />
      <Footer />
    </div>
  )
}