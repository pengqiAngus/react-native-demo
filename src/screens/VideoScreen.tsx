import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
  PanResponder,
} from 'react-native';
import Video from 'react-native-video';
import { Video as VideoType } from '../types';
import { formatTime, formatNumber, formatDuration } from '../utils';
import StorageService from '../services/StorageService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

interface VideoItemProps {
  item: VideoType;
  isActive: boolean;
  onLike: (id: string) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ item, isActive, onLike }) => {
  const [paused, setPaused] = useState(!isActive);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setPaused(!isActive);
    setLoading(isActive);
  }, [isActive]);

  const handleVideoPress = () => {
    if (isActive) {
      setPaused(!paused);
      setShowControls(true);
      
      // 隐藏控制按钮
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }, 2000);
      });
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <View style={styles.videoContainer}>
      <TouchableOpacity
        style={styles.videoWrapper}
        onPress={handleVideoPress}
        activeOpacity={1}
      >
        <Video
          source={{ uri: item.videoUrl }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={paused}
          muted={muted}
          onLoad={handleLoad}
        />
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        <Animated.View
          style={[
            styles.controlsOverlay,
            { opacity: fadeAnim },
          ]}
        >
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setPaused(!paused)}
          >
            <Icon
              name={paused ? 'play-arrow' : 'pause'}
              size={60}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.videoInfo}>
        <View style={styles.videoMeta}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription}>{item.description}</Text>
          <View style={styles.authorInfo}>
            <Image
              source={{ uri: item.author.avatar }}
              style={styles.authorAvatar}
            />
            <Text style={styles.authorName}>{item.author.name}</Text>
            <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.videoActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onLike(item.id)}
          >
            <Icon name="favorite-border" size={28} color="#fff" />
            <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="comment" size={28} color="#fff" />
            <Text style={styles.actionText}>{item.comments.length}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={28} color="#fff" />
            <Text style={styles.actionText}>分享</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setMuted(!muted)}
          >
            <Icon
              name={muted ? 'volume-off' : 'volume-up'}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const VideoScreen: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const storageService = StorageService.getInstance();

  const loadVideos = async () => {
    try {
      const videosData = await storageService.getVideos();
      setVideos(videosData);
    } catch (error) {
      console.error('加载视频失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId: string) => {
    try {
      await storageService.likeVideo(videoId);
      const updatedVideos = videos.map(video =>
        video.id === videoId
          ? { ...video, likes: video.likes + 1 }
          : video
      );
      setVideos(updatedVideos);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    loadVideos();
  }, []);

  const renderVideoItem = ({ item, index }: { item: VideoType; index: number }) => (
    <VideoItem
      item={item}
      isActive={index === currentIndex}
      onLike={handleLike}
    />
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
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width,
    height,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  },
  videoMeta: {
    flex: 1,
    marginRight: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 20,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginRight: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#ccc',
  },
  videoActions: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
});

export default VideoScreen;