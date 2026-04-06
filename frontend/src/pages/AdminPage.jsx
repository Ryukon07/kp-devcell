import { useState } from 'react'
import MembersAdmin from '../components/admin/MembersAdmin.jsx'
import ProjectsAdmin from '../components/admin/ProjectsAdmin.jsx'
import EventsAdmin from '../components/admin/EventsAdmin.jsx'
import PostsAdmin from '../components/admin/PostsAdmin.jsx'

const tabs = ['Members', 'Projects', 'Events', 'Posts']

function AdminPage() {
  const [activeTab, setActiveTab] = useState('Members')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage KP Dev Cell content</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-800 pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
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
          {activeTab === 'Projects' && <ProjectsAdmin />}
          {activeTab === 'Events' && <EventsAdmin />}
          {activeTab === 'Posts' && <PostsAdmin />}
        </div>

      </div>
    </div>
  )
}

export default AdminPage