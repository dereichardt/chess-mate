import api from './api'

export const chessService = {
  async getLessons() {
    const { data } = await api.get('/lessons')
    return data
  },

  async getLessonById(id: string) {
    const { data } = await api.get(`/lessons/${id}`)
    return data
  },

  async getPuzzles(difficulty?: string) {
    const params = difficulty ? { difficulty } : {}
    const { data } = await api.get('/puzzles', { params })
    return data
  },

  async getPuzzleById(id: string) {
    const { data } = await api.get(`/puzzles/${id}`)
    return data
  },

  async getProgress() {
    const { data } = await api.get('/progress')
    return data
  },

  async updateLessonProgress(lessonId: string, completed: boolean, progress: number) {
    const { data } = await api.post(`/progress/lesson/${lessonId}`, {
      completed,
      progress,
    })
    return data
  },
}
