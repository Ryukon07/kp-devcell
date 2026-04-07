import { useState, useEffect } from 'react'
import { auth } from '../../firebase.js'
import api from '../../api.js'
import toast from 'react-hot-toast'

function AdminAccessPanel() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [personalEmails, setPersonalEmails] = useState({})

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await api.get('/admin-access', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMembers(res.data)
    } catch (err) {
      toast.error('Failed to fetch members')
    }
  }

  const handleGiveAccess = async (member) => {
    const personalEmail = personalEmails[member._id]
    if (!personalEmail) {
      toast.error('Enter personal email first')
      return
    }
    setLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      await api.post(`/admin-access/give/${member._id}`,
        { personalEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Admin access given to ${member.name}`)
      fetchMembers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAccess = async (member) => {
    if (!confirm(`Remove admin access from ${member.name}?`)) return
    setLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      await api.post(`/admin-access/remove/${member._id}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Access removed from ${member.name}`)
      fetchMembers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-2">Admin Access</h2>
      <p className="text-gray-400 text-sm mb-6">
        Give or remove admin access for members. They will receive login credentials via email.
      </p>

      {members.length === 0 ? (
        <p className="text-gray-500 text-sm">No members found. Add members first.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {members.map(member => (
            <div key={member._id} className="bg-gray-800 rounded-xl px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-gray-400 text-sm">{member.role} · Batch {member.batch}</p>
                  {member.hasAdminAccess && (
                    <p className="text-purple-400 text-xs mt-1">
                      Has access · {member.adminEmail}
                    </p>
                  )}
                </div>

                {member.hasAdminAccess ? (
                  <button
                    onClick={() => handleRemoveAccess(member)}
                    disabled={loading}
                    className="text-sm text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Remove Access
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="Their personal email"
                      value={personalEmails[member._id] || ''}
                      onChange={(e) => setPersonalEmails(prev => ({
                        ...prev,
                        [member._id]: e.target.value
                      }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500 transition-colors w-52"
                    />
                    <button
                      onClick={() => handleGiveAccess(member)}
                      disabled={loading}
                      className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Give Access
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminAccessPanel