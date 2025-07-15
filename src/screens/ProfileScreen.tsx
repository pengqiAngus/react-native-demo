import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { User, Post } from '../types';
import { formatTime, formatNumber } from '../utils';
import StorageService from '../services/StorageService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    postsCount: 0,
    likesCount: 0,
    followersCount: 0,
  });
  const storageService = StorageService.getInstance();

  const loadUserData = async () => {
    try {
      const currentUser = await storageService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const userPosts = await storageService.getPosts();
        const filteredPosts = userPosts.filter(post => post.authorId === currentUser.id);
        setPosts(filteredPosts);
        
        const totalLikes = filteredPosts.reduce((total, post) => total + post.likes, 0);
        setStats({
          postsCount: filteredPosts.length,
          likesCount: totalLikes,
          followersCount: Math.floor(Math.random() * 1000) + 100, // 模拟粉丝数
        });
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 模拟Google登录
      const mockGoogleUser: User = {
        id: 'google_user_' + Date.now(),
        name: 'Google用户',
        email: 'user@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        isGoogleUser: true,
        createdAt: new Date(),
      };
      
      await storageService.setCurrentUser(mockGoogleUser);
      setUser(mockGoogleUser);
      Alert.alert('登录成功', '欢迎使用Google账户登录！');
    } catch (error) {
      console.error('Google登录失败:', error);
      Alert.alert('登录失败', '请稍后重试');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            try {
              await storageService.logout();
              setUser(null);
              setPosts([]);
              setStats({ postsCount: 0, likesCount: 0, followersCount: 0 });
            } catch (error) {
              console.error('退出登录失败:', error);
            }
          },
        },
      ]
    );
  };

  const handleCreatePost = () => {
    if (!user) {
      Alert.alert('请先登录', '登录后才能发布内容');
      return;
    }
    navigation.navigate('CreatePost');
  };

  const handleAvatarPress = () => {
    if (!user) return;
    
    Alert.alert(
      '更换头像',
      '选择头像来源',
      [
        { text: '取消', style: 'cancel' },
        { text: '相册选择', onPress: () => console.log('选择相册') },
        { text: '拍照', onPress: () => console.log('拍照') },
      ]
    );
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const renderPostItem = (post: Post) => (
    <View key={post.id} style={styles.postItem}>
      {post.mediaUrl && (
        <Image
          source={{ uri: post.mediaUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postDescription} numberOfLines={2}>
          {post.content}
        </Text>
        <View style={styles.postFooter}>
          <Text style={styles.postTime}>{formatTime(post.createdAt)}</Text>
          <View style={styles.postActions}>
            <Icon name="favorite" size={16} color="#ff4757" />
            <Text style={styles.postActionText}>{formatNumber(post.likes)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleAvatarPress}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
                }}
                style={styles.avatar}
              />
              <View style={styles.avatarOverlay}>
                <Icon name="camera-alt" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>
            {user?.name || '未登录用户'}
          </Text>
          
          <Text style={styles.userEmail}>
            {user?.email || '请登录'}
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.postsCount}</Text>
              <Text style={styles.statLabel}>发布</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(stats.likesCount)}</Text>
              <Text style={styles.statLabel}>点赞</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(stats.followersCount)}</Text>
              <Text style={styles.statLabel}>粉丝</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.actionButtons}>
          {!user ? (
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Icon name="g-translate" size={20} color="#fff" />
              <Text style={styles.buttonText}>Google登录</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Icon name="logout" size={20} color="#fff" />
              <Text style={styles.buttonText}>退出登录</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreatePost}
          >
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.buttonText}>发布内容</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的发布</Text>
          {posts.length > 0 ? (
            posts.map(renderPostItem)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="post-add" size={48} color="#ccc" />
              <Text style={styles.emptyText}>还没有发布任何内容</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.emptyButtonText}>立即发布</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  content: {
    padding: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#db4437',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  postItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileScreen;