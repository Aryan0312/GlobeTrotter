// import api from './api' // Ready for real API integration

interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  content: string
  images: string[]
  likes: number
  comments: number
  createdAt: string
  tripId?: string
}

interface CreatePostRequest {
  content: string
  images?: string[]
  tripId?: string
}

interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

// Mock data
const mockPosts: CommunityPost[] = [
  {
    id: '1',
    authorId: 'user1',
    authorName: 'John Doe',
    content: 'Amazing sushi experience in Tokyo! 🍣',
    images: ['/images/sushi.jpg'],
    likes: 24,
    comments: 5,
    createdAt: '2024-01-15T10:30:00Z',
    tripId: '1',
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'Jane Smith',
    content: 'The Eiffel Tower at sunset is breathtaking! 🗼',
    images: ['/images/eiffel.jpg'],
    likes: 18,
    comments: 3,
    createdAt: '2024-01-14T18:45:00Z',
  },
]

const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    authorId: 'user3',
    authorName: 'Mike Johnson',
    content: 'Looks delicious! Where was this?',
    createdAt: '2024-01-15T11:00:00Z',
  },
]

export const communityService = {
  async getPosts(): Promise<CommunityPost[]> {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async createPost(data: CreatePostRequest): Promise<CommunityPost> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      authorId: 'user1',
      authorName: 'Current User',
      content: data.content,
      images: data.images || [],
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      tripId: data.tripId,
    }
    
    mockPosts.unshift(newPost)
    return newPost
  },

  async likePost(postId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const post = mockPosts.find(p => p.id === postId)
    if (post) {
      post.likes += 1
    }
  },

  async getComments(postId: string): Promise<Comment[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockComments.filter(c => c.postId === postId)
  },

  async addComment(postId: string, content: string): Promise<Comment> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      authorId: 'user1',
      authorName: 'Current User',
      content,
      createdAt: new Date().toISOString(),
    }
    
    mockComments.push(newComment)
    
    const post = mockPosts.find(p => p.id === postId)
    if (post) {
      post.comments += 1
    }
    
    return newComment
  },
}