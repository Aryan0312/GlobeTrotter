import api from './api'

interface LoginRequest {
  identifier: string
  password: string
}

interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  city?: string
  country?: string
  additionalInfo?: string
}

interface User {
  id: string
  identifier: string
  name: string
  role: 'user' | 'admin'
}

interface AuthResponse {
  user: User
}

// Mock data

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile')
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },
}