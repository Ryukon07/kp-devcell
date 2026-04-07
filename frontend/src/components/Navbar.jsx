import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-white font-bold text-xl tracking-tight">
        KP Dev Cell
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/events" className="text-gray-400 hover:text-white transition-colors text-sm">
          Events
        </Link>
        <Link to="/resources" className="text-gray-400 hover:text-white transition-colors text-sm">
          Resources
        </Link>
      </div>
    </nav>
  )
}

export default Navbar