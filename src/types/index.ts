export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isGoogleUser: boolean;
  createdAt: Date;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  image?: string;
  authorId: string;
  author: User;
  createdAt: Date;
  likes: number;
  comments: Comment[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  authorId: string;
  author: User;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  duration: number;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
}

export interface Post {
  id: string;
  type: 'article' | 'video' | 'text';
  title: string;
  content: string;
  mediaUrl?: string;
  authorId: string;
  author: User;
  createdAt: Date;
  likes: number;
  comments: Comment[];
}

export interface AppState {
  user: User | null;
  articles: Article[];
  videos: Video[];
  posts: Post[];
  loading: boolean;
}