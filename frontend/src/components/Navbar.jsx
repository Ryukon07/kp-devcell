import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

function Navbar() {
  const { user } = useAuth()

  const handleLogout = async () => {
    await signOut(auth)
    toast.success('Logged out')
  }

  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-white font-bold text-xl">
        KP Dev Cell
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
        <Link to="/team" className="text-gray-400 hover:text-white transition-colors text-sm">Team</Link>
        <Link to="/projects" className="text-gray-400 hover:text-white transition-colors text-sm">Projects</Link>
        <Link to="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Events</Link>
        <Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link>
        <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">Admin</Link>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar