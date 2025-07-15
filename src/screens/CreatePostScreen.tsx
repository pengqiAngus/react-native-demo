import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { User, Post } from '../types';
import { generateId } from '../utils';
import StorageService from '../services/StorageService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface CreatePostScreenProps {
  navigation: any;
}

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [postType, setPostType] = useState<'text' | 'article' | 'video'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const storageService = StorageService.getInstance();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await storageService.getCurrentUser();
      if (!currentUser) {
        Alert.alert('未登录', '请先登录后再发布内容');
        navigation.goBack();
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error('加载用户失败:', error);
    }
  };

  const handleSelectMedia = () => {
    const options = [];
    
    if (postType === 'article') {
      options.push({ text: '选择图片', onPress: () => selectImage() });
    } else if (postType === 'video') {
      options.push({ text: '选择视频', onPress: () => selectVideo() });
    }
    
    options.push({ text: '取消', style: 'cancel' });
    
    Alert.alert('选择媒体', '请选择要上传的媒体文件', options);
  };

  const selectImage = () => {
    // 模拟选择图片
    const mockImageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    setSelectedMedia(mockImageUrl);
    setMediaUrl(mockImageUrl);
  };

  const selectVideo = () => {
    // 模拟选择视频
    const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    setSelectedMedia(mockVideoUrl);
    setMediaUrl(mockVideoUrl);
  };

  const handlePublish = async () => {
    if (!user) {
      Alert.alert('错误', '用户信息异常，请重新登录');
      return;
    }

    if (!title.trim()) {
      Alert.alert('提示', '请输入标题');
      return;
    }

    if (!content.trim()) {
      Alert.alert('提示', '请输入内容');
      return;
    }

    if (postType !== 'text' && !mediaUrl) {
      Alert.alert('提示', '请选择媒体文件');
      return;
    }

    setLoading(true);

    try {
      const newPost: Post = {
        id: generateId(),
        type: postType,
        title: title.trim(),
        content: content.trim(),
        mediaUrl: mediaUrl || undefined,
        authorId: user.id,
        author: user,
        createdAt: new Date(),
        likes: 0,
        comments: [],
      };

      await storageService.addPost(newPost);
      
      // 如果是文章类型，也添加到文章列表
      if (postType === 'article') {
        const article = {
          id: newPost.id,
          title: newPost.title,
          content: newPost.content,
          image: newPost.mediaUrl,
          authorId: newPost.authorId,
          author: newPost.author,
          createdAt: newPost.createdAt,
          likes: 0,
          comments: [],
        };
        await storageService.addArticle(article);
      }

      // 如果是视频类型，也添加到视频列表
      if (postType === 'video') {
        const video = {
          id: newPost.id,
          title: newPost.title,
          description: newPost.content,
          videoUrl: newPost.mediaUrl!,
          thumbnail: `https://picsum.photos/300/400?random=${Date.now()}`,
          authorId: newPost.authorId,
          author: newPost.author,
          createdAt: newPost.createdAt,
          likes: 0,
          comments: [],
          duration: 180, // 模拟视频时长
        };
        await storageService.addVideo(video);
      }

      Alert.alert('发布成功', '内容已成功发布！', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('发布失败:', error);
      Alert.alert('发布失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const renderPostTypeSelector = () => (
    <View style={styles.typeSelector}>
      <TouchableOpacity
        style={[
          styles.typeButton,
          postType === 'text' && styles.typeButtonActive,
        ]}
        onPress={() => setPostType('text')}
      >
        <Icon
          name="text-fields"
          size={20}
          color={postType === 'text' ? '#007AFF' : '#666'}
        />
        <Text
          style={[
            styles.typeButtonText,
            postType === 'text' && styles.typeButtonTextActive,
          ]}
        >
          文字
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeButton,
          postType === 'article' && styles.typeButtonActive,
        ]}
        onPress={() => setPostType('article')}
      >
        <Icon
          name="article"
          size={20}
          color={postType === 'article' ? '#007AFF' : '#666'}
        />
        <Text
          style={[
            styles.typeButtonText,
            postType === 'article' && styles.typeButtonTextActive,
          ]}
        >
          文章
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeButton,
          postType === 'video' && styles.typeButtonActive,
        ]}
        onPress={() => setPostType('video')}
      >
        <Icon
          name="videocam"
          size={20}
          color={postType === 'video' ? '#007AFF' : '#666'}
        />
        <Text
          style={[
            styles.typeButtonText,
            postType === 'video' && styles.typeButtonTextActive,
          ]}
        >
          视频
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderMediaSection = () => {
    if (postType === 'text') return null;

    return (
      <View style={styles.mediaSection}>
        <Text style={styles.label}>
          {postType === 'article' ? '选择图片' : '选择视频'}
        </Text>
        
        {selectedMedia ? (
          <View style={styles.mediaPreview}>
            {postType === 'article' ? (
              <Image
                source={{ uri: selectedMedia }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.videoPreview}>
                <Icon name="play-circle-outline" size={60} color="#007AFF" />
                <Text style={styles.videoText}>视频已选择</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.changeMediaButton}
              onPress={handleSelectMedia}
            >
              <Text style={styles.changeMediaText}>更换</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.selectMediaButton}
            onPress={handleSelectMedia}
          >
            <Icon
              name={postType === 'article' ? 'image' : 'videocam'}
              size={40}
              color="#007AFF"
            />
            <Text style={styles.selectMediaText}>
              {postType === 'article' ? '选择图片' : '选择视频'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>发布内容</Text>
        <TouchableOpacity
          style={[styles.publishButton, loading && styles.publishButtonDisabled]}
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.publishButtonText}>发布</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderPostTypeSelector()}

        <View style={styles.inputSection}>
          <Text style={styles.label}>标题</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="输入标题..."
            placeholderTextColor="#999"
            maxLength={100}
          />
        </View>

        {renderMediaSection()}

        <View style={styles.inputSection}>
          <Text style={styles.label}>内容</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder={
              postType === 'article'
                ? '分享你的观点和想法...'
                : postType === 'video'
                ? '描述视频内容...'
                : '说点什么...'
            }
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.charCount}>{content.length}/1000</Text>
        </View>

        <View style={styles.tips}>
          <Icon name="info-outline" size={16} color="#666" />
          <Text style={styles.tipsText}>
            {postType === 'text' && '发布纯文字内容'}
            {postType === 'article' && '发布图文并茂的文章'}
            {postType === 'video' && '发布视频内容'}
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  publishButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: '#ccc',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: '#f0f8ff',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contentInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  mediaSection: {
    marginBottom: 20,
  },
  selectMediaButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  selectMediaText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 8,
  },
  mediaPreview: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  videoPreview: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  videoText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  changeMediaButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeMediaText: {
    color: '#fff',
    fontSize: 12,
  },
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});

export default CreatePostScreen;