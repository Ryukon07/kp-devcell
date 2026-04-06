import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../../api.js'
import { auth } from '../../firebase.js'

const emptyForm = {
  name: '', date: '', description: '',
  image_url: '', registration_link: '', featured: false
}

function PostsAdmin() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])
  
  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts')
      setPosts(res.data)
    } catch (err) {
      toast.error('Failed to fetch posts')
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
        await api.put(`/posts/${editingId}`, form, config)
        toast.success('Post updated')
      } else {
        await api.post('/posts', form, config)
        toast.success('Post added')
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchPosts()
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post) => {
    setForm({
      name: post.name,
      date: post.date,
      description: post.description,
      image_url: post.image_url,
      registration_link: post.registration_link,
      featured: post.featured
    })
    setEditingId(post.id)
  } 

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    setLoading(true)
    try {
      const config = await getToken()
      await api.delete(`/posts/${id}`, config)
      toast.success('Post deleted')
      fetchPosts()
    } catch (err) {
      toast.error('Failed to delete post')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }
}

export default PostsAdmin