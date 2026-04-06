import { useState, useEffect } from 'react'
import api from '../../api.js'
import { auth } from '../../firebase.js'
import toast from 'react-hot-toast'

const emptyForm = {
  title: '', description: '', date: '',
  location: '', image_url: '', registration_link: '', featured: false
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
    return { headers : { Authorization: `Bearer ${token}` } }
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
            date: event.date,
            location: event.location,
            image_url: event.image_url,
            registration_link: event.registration_link,
            featured: event.featured
        })
        setEditingId(event._id)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return
        setLoading(true)
        try {
            const config = await getToken()
            await api.delete(`/events/${id}`, config)
            toast.success('Event deleted')
            fetchEvents()
        } catch (err) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }  
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
}

export default EventsAdmin