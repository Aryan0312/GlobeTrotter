// import api from './api' // Ready for real API integration

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  name: string
}

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

interface AuthResponse {
  token: string
  user: User
}

// Mock data
const mockUsers: User[] = [
  { id: '1', email: 'user@example.com', name: 'John Doe', role: 'user' },
  { id: '2', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
]

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers.find(u => u.email === data.email)
    if (!user || data.password !== 'password') {
      throw new Error('Invalid credentials')
    }
    
    return {
      token: `mock-jwt-token-${user.id}`,
      user,
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
    }
    
    return {
      token: `mock-jwt-token-${newUser.id}`,
      user: newUser,
    }
  },

  async getProfile(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockUsers[0]
  },
}