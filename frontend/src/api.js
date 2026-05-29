import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
})

export const searchQuestions = (params) =>
  api.get('/search', { params })

export const getQuestion = (id) =>
  api.get(`/question/${id}`)

export const getCompanies = () =>
  api.get('/companies')

export const getTopQuestions = (limit = 20) =>
  api.get('/top', { params: { limit } })

export const getStats = () =>
  api.get('/stats')

export default api
