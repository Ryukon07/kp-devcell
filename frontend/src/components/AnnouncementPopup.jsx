import { useState, useEffect } from 'react'
import api from '../api.js'

function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchLatestAnnouncement()
  }, [])

  const fetchLatestAnnouncement = async () => {
    try {
      const res = await api.get('/announcements')
      if (res.data.length > 0) {
        const latest = res.data[0]
        const dismissed = sessionStorage.getItem(`dismissed_${latest._id}`)
        if (!dismissed) {
          setAnnouncement(latest)
          setVisible(true)
        }
      }
    } catch (err) {
      console.error('Failed to fetch announcement')
    }
  }

  const handleClose = () => {
    sessionStorage.setItem(`dismissed_${announcement._id}`, 'true')
    setVisible(false)
  }

  if (!visible || !announcement) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={handleClose}
      />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="text-purple-400 text-xs font-medium uppercase tracking-wider">
              Announcement
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <h2 className="text-xl font-bold text-white mb-3">
          {announcement.title}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          {announcement.message}
        </p>

        <button
          onClick={handleClose}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

export default AnnouncementPopup