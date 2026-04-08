import axios from 'axios'

const api = axios.create({ baseURL: 'https://kp-devcell-backend.onrender.com/api' })

export default api