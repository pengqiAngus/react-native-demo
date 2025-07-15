import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Article, Video, Post } from '../types';
import { mockUsers, mockArticles, mockVideos } from '../data/mockData';

class StorageService {
  private static instance: StorageService;
  
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // 初始化数据
  async initializeData() {
    try {
      const existingArticles = await AsyncStorage.getItem('articles');
      const existingVideos = await AsyncStorage.getItem('videos');
      const existingUsers = await AsyncStorage.getItem('users');

      if (!existingArticles) {
        await AsyncStorage.setItem('articles', JSON.stringify(mockArticles));
      }
      if (!existingVideos) {
        await AsyncStorage.setItem('videos', JSON.stringify(mockVideos));
      }
      if (!existingUsers) {
        await AsyncStorage.setItem('users', JSON.stringify(mockUsers));
      }
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  }

  // 用户相关
  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('获取当前用户失败:', error);
      return null;
    }
  }

  async setCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('设置当前用户失败:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('currentUser');
    } catch (error) {
      console.error('登出失败:', error);
    }
  }

  // 文章相关
  async getArticles(): Promise<Article[]> {
    try {
      const articlesStr = await AsyncStorage.getItem('articles');
      return articlesStr ? JSON.parse(articlesStr) : [];
    } catch (error) {
      console.error('获取文章失败:', error);
      return [];
    }
  }

  async addArticle(article: Article): Promise<void> {
    try {
      const articles = await this.getArticles();
      articles.unshift(article);
      await AsyncStorage.setItem('articles', JSON.stringify(articles));
    } catch (error) {
      console.error('添加文章失败:', error);
    }
  }

  // 视频相关
  async getVideos(): Promise<Video[]> {
    try {
      const videosStr = await AsyncStorage.getItem('videos');
      return videosStr ? JSON.parse(videosStr) : [];
    } catch (error) {
      console.error('获取视频失败:', error);
      return [];
    }
  }

  async addVideo(video: Video): Promise<void> {
    try {
      const videos = await this.getVideos();
      videos.unshift(video);
      await AsyncStorage.setItem('videos', JSON.stringify(videos));
    } catch (error) {
      console.error('添加视频失败:', error);
    }
  }

  // 帖子相关
  async getPosts(): Promise<Post[]> {
    try {
      const postsStr = await AsyncStorage.getItem('posts');
      return postsStr ? JSON.parse(postsStr) : [];
    } catch (error) {
      console.error('获取帖子失败:', error);
      return [];
    }
  }

  async addPost(post: Post): Promise<void> {
    try {
      const posts = await this.getPosts();
      posts.unshift(post);
      await AsyncStorage.setItem('posts', JSON.stringify(posts));
    } catch (error) {
      console.error('添加帖子失败:', error);
    }
  }

  // 点赞功能
  async likeArticle(articleId: string): Promise<void> {
    try {
      const articles = await this.getArticles();
      const articleIndex = articles.findIndex(a => a.id === articleId);
      if (articleIndex !== -1) {
        articles[articleIndex].likes += 1;
        await AsyncStorage.setItem('articles', JSON.stringify(articles));
      }
    } catch (error) {
      console.error('点赞文章失败:', error);
    }
  }

  async likeVideo(videoId: string): Promise<void> {
    try {
      const videos = await this.getVideos();
      const videoIndex = videos.findIndex(v => v.id === videoId);
      if (videoIndex !== -1) {
        videos[videoIndex].likes += 1;
        await AsyncStorage.setItem('videos', JSON.stringify(videos));
      }
    } catch (error) {
      console.error('点赞视频失败:', error);
    }
  }
}

export default StorageService;