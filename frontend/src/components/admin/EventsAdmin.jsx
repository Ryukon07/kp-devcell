import { useState, useEffect } from 'react'
import { auth } from '../../firebase.js'
import api from '../../api.js'
import toast from 'react-hot-toast'

const emptyForm = {
  title: '',
  description: '',
  date: '',
  type: 'upcoming',
  image_url: ''
}

function EventsAdmin() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data)
    } catch (err) {
      toast.error('Failed to fetch events')
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
        await api.put(`/events/${editingId}`, form, config)
        toast.success('Event updated')
      } else {
        await api.post('/events', form, config)
        toast.success('Event added')
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchEvents()
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      type: event.type,
      image_url: event.image_url
    })
    setEditingId(event._id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    try {
      const config = await getToken()
      await api.delete(`/events/${id}`, config)
      toast.success('Event deleted')
      fetchEvents()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          {editingId ? 'Edit Event' : 'Add New Event'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-colors text-sm"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-colors text-sm"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-colors text-sm resize-none"
            />
          </div>

          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : editingId ? 'Update Event' : 'Add Event'}
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
        <h2 className="text-xl font-semibold mb-6">All Events ({events.length})</h2>
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No events yet. Add one above.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map(event => (
              <div key={event._id} className="flex items-center justify-between bg-gray-800 rounded-xl px-5 py-4">
                <div>
                  <p className="text-white font-medium">{event.title}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(event.date).toLocaleDateString()} ·{' '}
                    <span className={event.type === 'upcoming' ? 'text-green-400' : 'text-gray-400'}>
                      {event.type}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-sm text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsAdmin