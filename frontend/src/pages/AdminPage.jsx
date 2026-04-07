import { useState } from 'react'
import MembersAdmin from '../components/admin/MembersAdmin.jsx'
import EventsAdmin from '../components/admin/EventsAdmin.jsx'
import AnnouncementsAdmin from '../components/admin/AnnouncementsAdmin.jsx'
import AdminAccessPanel from '../components/admin/AdminAccessPanel.jsx'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const tabs = ['Members', 'Events', 'Announcements', 'Admin Access']

function AdminPage() {
  const [activeTab, setActiveTab] = useState('Members')

  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage KP Dev Cell content</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'Members' && <MembersAdmin />}
          {activeTab === 'Events' && <EventsAdmin />}
          {activeTab === 'Announcements' && <AnnouncementsAdmin />}
          {activeTab === 'Admin Access' && <AdminAccessPanel />}
        </div>

      </div>
    </div>
  )
}

export default AdminPage