import { useState, useEffect } from 'react'
import { auth } from '../../firebase.js'
import api from '../../api.js'
import toast from 'react-hot-toast'

const emptyForm = {
  title: '',
  message: '',
  active: true
}

function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchAnnouncements() }, [])

  const fetchAnnouncements = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await api.get('/announcements/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(res.data)
    } catch (err) {
      toast.error('Failed to fetch announcements')
    }
  }

  const getToken = async () => {
    const token = await auth.currentUser.getIdToken()
    return { headers: { Authorization: `Bearer ${token}` } }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const config = await getToken()
      if (editingId) {
        await api.put(`/announcements/${editingId}`, form, config)
        toast.success('Announcement updated')
      } else {
        await api.post('/announcements', form, config)
        toast.success('Announcement added')
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchAnnouncements()
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      message: announcement.message,
      active: announcement.active
    })
    setEditingId(announcement._id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return
    try {
      const config = await getToken()
      await api.delete(`/announcements/${id}`, config)
      toast.success('Announcement deleted')
      fetchAnnouncements()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">
          {editingId ? 'Edit Announcement' : 'New Announcement'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Active announcements float on the hero section of the homepage as clickable cards. Up to 3 active announcements are shown at a time.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-colors text-sm"
              placeholder="e.g. Recruitment Open!"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-colors text-sm resize-none"
              placeholder="Write your announcement here..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="w-4 h-4 accent-purple-600"
            />
            <label className="text-gray-400 text-sm">
              Active — show on homepage hero
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Post Announcement'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setForm(emptyForm); setEditingId(null) }}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-6 py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          All Announcements ({announcements.length})
        </h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {announcements.map(announcement => (
              <div key={announcement._id} className="bg-gray-800 rounded-xl px-5 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium">{announcement.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        announcement.active
                          ? 'bg-green-900 text-green-400'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {announcement.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{announcement.message}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="text-sm text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnnouncementsAdmin