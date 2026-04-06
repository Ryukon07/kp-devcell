import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { user } = useAuth()

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/team">Team</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/events">Events</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/contact">Contact</Link>
      {user && <Link to="/admin">Admin</Link>}
      {!user && <Link to="/login">Login</Link>}
    </nav>
  )
}

export default Navbar