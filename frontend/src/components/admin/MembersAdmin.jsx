import { useState, useEffect } from 'react'
import { auth } from '../../firebase.js'
import api from '../../api.js'
import toast from 'react-hot-toast'

const emptyForm = {
  name: '', role: '', bio: '', photo_url: '',
  github: '', linkedin: '', batch: '', isCore: false
}

function MembersAdmin() {
  const [members, setMembers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members')
      setMembers(res.data)
    } catch (err) {
      toast.error('Failed to fetch members')
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
        await api.put(`/members/${editingId}`, form, config)
        toast.success('Member updated')
      } else {
        await api.post('/members', form, config)
        toast.success('Member added')
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchMembers()
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      photo_url: member.photo_url,
      github: member.github,
      linkedin: member.linkedin,
      batch: member.batch,
      isCore: member.isCore
    })
    setEditingId(member._id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return
    try {
      const config = await getToken()
      await api.delete(`/members/${id}`, config)
      toast.success('Member deleted')
      fetchMembers()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="flex flex-col gap-8">

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          {editingId ? 'Edit Member' : 'Add New Member'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {[
            { label: 'Name', name: 'name', type: 'text', required: true },
            { label: 'Role', name: 'role', type: 'text', required: true },
            { label: 'Team', name: 'batch', type: 'text', required: true },
            { label: 'Photo URL', name: 'photo_url', type: 'text' },
            { label: 'GitHub URL', name: 'github', type: 'text' },
            { label: 'LinkedIn URL', name: 'linkedin', type: 'text' },
          ].map(field => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-colors text-sm"
              />
            </div>
          ))}

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
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
              {loading ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}
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
        <h2 className="text-xl font-semibold mb-6">All Members ({members.length})</h2>
        {members.length === 0 ? (
          <p className="text-gray-500 text-sm">No members yet. Add one above.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map(member => (
              <div key={member._id} className="flex items-center justify-between bg-gray-800 rounded-xl px-5 py-4">
                <div>
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-gray-400 text-sm">{member.role} · {member.batch}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-sm text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
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

export default MembersAdmin