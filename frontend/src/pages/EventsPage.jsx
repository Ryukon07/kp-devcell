import { useState, useEffect } from 'react'
import api from '../api.js'

function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data)
    } catch (err) {
      console.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const filtered = events.filter(event => {
    if (filter === 'all') return true
    return event.type === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Events</h1>
          <p className="text-gray-400">Workshops, sessions and competitions by KP Dev Cell</p>
        </div>

        <div className="flex gap-2 mb-8">
          {['all', 'upcoming', 'past'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filtered.map(event => (
              <div
                key={event._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex gap-6"
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-semibold text-white">{event.title}</h2>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ml-4 flex-shrink-0 ${
                      event.type === 'upcoming'
                        ? 'bg-green-900 text-green-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-purple-400 text-sm mb-3">
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default EventsPage