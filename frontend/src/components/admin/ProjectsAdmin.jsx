import { useState, useEffect } from 'react'
import { auth } from '../../firebase.js'
import api from '../../api.js'
import toast from 'react-hot-toast'

const emptyForm = {
  title: '', description: '', tech_stack: '',
  github_url: '', image_url: '', contributors: '', featured: false
}

function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      setProjects(res.data)
    } catch (err) {
      toast.error('Failed to fetch projects')
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
      const payload = {
        ...form,
        tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
        contributors: form.contributors.split(',').map(s => s.trim()).filter(Boolean)
      }
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload, config)
        toast.success('Project updated')
      } else {
        await api.post('/projects', payload, config)
        toast.success('Project added')
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchProjects()
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack.join(', '),
      github_url: project.github_url,
      image_url: project.image_url,
      contributors: project.contributors.join(', '),
      featured: project.featured
    })
    setEditingId(project._id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      const config = await getToken()
      await api.delete(`/projects/${id}`, config)
      toast.success('Project deleted')
      fetchProjects()
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
        <h2 className="text-xl font-semibold mb-6">
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {[
            { label: 'Title', name: 'title', required: true },
            { label: 'GitHub URL', name: 'github_url' },
            { label: 'Image URL', name: 'image_url' },
            { label: 'Tech Stack (comma separated)', name: 'tech_stack' },
            { label: 'Contributors (comma separated)', name: 'contributors' },
          ].map(field => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-colors text-sm"
              />
            </div>
          ))}

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

          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 accent-purple-600"
            />
            <label className="text-gray-400 text-sm">Featured project</label>
          </div>

          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
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
        <h2 className="text-xl font-semibold mb-6">All Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm">No projects yet. Add one above.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map(project => (
              <div key={project._id} className="flex items-center justify-between bg-gray-800 rounded-xl px-5 py-4">
                <div>
                  <p className="text-white font-medium">{project.title}</p>
                  <p className="text-gray-400 text-sm">{project.tech_stack.join(', ')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="text-sm text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(project._id)} className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsAdmin