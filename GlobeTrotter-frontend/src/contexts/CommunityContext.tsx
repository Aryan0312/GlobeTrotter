import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

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

interface CommunityContextType {
  posts: CommunityPost[]
  addPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'createdAt'>) => void
  likePost: (postId: string) => void
  deletePost: (postId: string) => void
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<CommunityPost[]>([])

  const addPost = (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'createdAt'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    }
    setPosts(prev => [newPost, ...prev])
  }

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
  }

  return (
    <CommunityContext.Provider value={{ posts, addPost, likePost, deletePost }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider')
  }
  return context
}