import { useState } from 'react'
import { signInWithEmailAndPassword, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const credential = EmailAuthProvider.credential(email, password)
      await reauthenticateWithCredential(auth.currentUser || (await signInWithEmailAndPassword(auth, email, password)).user, credential)
      await updatePassword(auth.currentUser, newPassword)
      toast.success('Password changed successfully')
      navigate('/admin')
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect')
      } else if (err.code === 'auth/user-not-found') {
        toast.error('No account found with this email')
      } else {
        toast.error('Something went wrong — try logging in first')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? 'Admin Login' : 'Change Password'}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === 'login'
              ? 'KP Dev Cell — restricted access'
              : 'Enter your current and new password'}
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-400 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition-colors mt-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-gray-500 text-sm">
              First time?{' '}
              <span
                onClick={() => setMode('change')}
                className="text-purple-400 cursor-pointer hover:text-purple-300"
              >
                Change your password
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-400 text-sm">Current Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-400 text-sm">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-400 text-sm">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition-colors mt-2"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>

            <p className="text-center text-gray-500 text-sm">
              Already changed it?{' '}
              <span
                onClick={() => setMode('login')}
                className="text-purple-400 cursor-pointer hover:text-purple-300"
              >
                Back to login
              </span>
            </p>
          </form>
        )}

      </div>
    </div>
  )
}

export default LoginPage